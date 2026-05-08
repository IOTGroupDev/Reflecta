import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Language, WeeklySummaryInput } from '../ai/ai.types';
import { PrismaService } from '../prisma/prisma.service';
import { SaveMoodDto, SaveSessionDto } from './journal.types';

const activityTags = new Set([
  'work',
  'relationships',
  'health',
  'sleep',
  'food',
  'caffeine',
  'movement',
  'alone',
  'overload',
]);

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async listSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async saveSession(dto: SaveSessionDto) {
    return this.prisma.session.create({
      data: {
        userId: dto.userId,
        scenario: dto.scenario,
        details: dto.details,
        activityTags: normalizeActivityTags(dto.activityTags),
        level: dto.level,
        text: dto.text,
        result: dto.result as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async deleteSession(userId: string, sessionId: string) {
    if (!isUuid(sessionId)) {
      throw new BadRequestException('Invalid session id');
    }

    const result = await this.prisma.session.deleteMany({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Session not found');
    }

    return { deleted: true };
  }

  async saveMood(dto: SaveMoodDto) {
    return this.prisma.moodEntry.create({
      data: {
        userId: dto.userId,
        mood: dto.mood,
        period: normalizeMoodPeriod(dto.period),
        rating: dto.rating,
        note: dto.note ? String(dto.note).trim().slice(0, 240) : undefined,
      },
    });
  }

  async summary(userId: string) {
    const now = new Date();
    const weekStart = getWeekStart(new Date());
    const previousWeekStart = new Date(weekStart);
    const sevenDaysStart = getDaysAgo(now, 7);
    const thirtyDaysStart = getDaysAgo(now, 30);

    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const [moods, sessions] = await Promise.all([
      this.prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      this.prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);

    const averageMood =
      moods.length > 0
        ? Number(
            (moods.reduce((sum, item) => sum + item.rating, 0) / moods.length).toFixed(1),
          )
        : null;
    const scenarioCounts = sessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.scenario] = (acc[session.scenario] ?? 0) + 1;
      return acc;
    }, {});
    const topScenario = Object.entries(scenarioCounts).sort((a, b) => b[1] - a[1])[0];
    const weeklyMoods = moods.filter((item) => item.createdAt >= weekStart);
    const previousWeeklyMoods = moods.filter(
      (item) => item.createdAt >= previousWeekStart && item.createdAt < weekStart,
    );
    const weeklySessions = sessions.filter((item) => item.createdAt >= weekStart);
    const weeklyScenarioCounts = weeklySessions.reduce<Record<string, number>>((acc, session) => {
      acc[session.scenario] = (acc[session.scenario] ?? 0) + 1;
      return acc;
    }, {});
    const weeklyTopScenario = Object.entries(weeklyScenarioCounts).sort((a, b) => b[1] - a[1])[0];
    const weeklyAverageMood = getAverageMood(weeklyMoods);
    const previousWeeklyAverageMood = getAverageMood(previousWeeklyMoods);
    const sevenDayMoods = moods.filter((item) => item.createdAt >= sevenDaysStart);
    const sevenDaySessions = sessions.filter((item) => item.createdAt >= sevenDaysStart);
    const thirtyDayMoods = moods.filter((item) => item.createdAt >= thirtyDaysStart);
    const thirtyDaySessions = sessions.filter((item) => item.createdAt >= thirtyDaysStart);
    const highIntensitySessions = sessions.filter((item) => item.level === 'high');

    return {
      averageMood,
      moodCount: moods.length,
      sessionCount: sessions.length,
      topScenario: topScenario
        ? {
            id: topScenario[0],
            count: topScenario[1],
          }
        : null,
      latestMood: moods[0] ?? null,
      latestSession: sessions[0] ?? null,
      week: {
        since: weekStart.toISOString(),
        averageMood: weeklyAverageMood,
        previousAverageMood: previousWeeklyAverageMood,
        moodDelta:
          weeklyAverageMood !== null && previousWeeklyAverageMood !== null
            ? Number((weeklyAverageMood - previousWeeklyAverageMood).toFixed(1))
            : null,
        moodCount: weeklyMoods.length,
        sessionCount: weeklySessions.length,
        topScenario: weeklyTopScenario
          ? {
              id: weeklyTopScenario[0],
              count: weeklyTopScenario[1],
            }
          : null,
      },
      windows: {
        sevenDays: getSummaryWindow(sevenDaysStart, sevenDayMoods, sevenDaySessions),
        thirtyDays: getSummaryWindow(thirtyDaysStart, thirtyDayMoods, thirtyDaySessions),
      },
      tagPatterns: {
        topTags: getTopTags(sessions),
        highIntensityTags: getTopTags(highIntensitySessions),
      },
      moodSeries: getMoodSeries(now, moods, 14),
    };
  }

  async weeklySummaryInput(userId: string, language?: Language): Promise<WeeklySummaryInput> {
    const now = new Date();
    const fourteenDaysStart = getDaysAgo(now, 13);
    const [moods, sessions] = await Promise.all([
      this.prisma.moodEntry.findMany({
        where: {
          userId,
          createdAt: {
            gte: fourteenDaysStart,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 40,
      }),
      this.prisma.session.findMany({
        where: {
          userId,
          createdAt: {
            gte: fourteenDaysStart,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
    ]);
    const highIntensitySessions = sessions.filter((item) => item.level === 'high');

    return {
      language,
      moodSeries: getMoodSeries(now, moods, 14),
      topTags: getTopTags(sessions),
      highIntensityTags: getTopTags(highIntensitySessions),
      sessions: sessions.map((session) => ({
        scenario: normalizeScenario(session.scenario),
        level: normalizeIntensity(session.level),
        details: session.details,
        activityTags: session.activityTags,
        text: session.text,
        createdAt: session.createdAt.toISOString(),
      })),
    };
  }
}

type MoodSummaryItem = {
  createdAt: Date;
  rating: number;
};

type SessionSummaryItem = {
  activityTags: string[];
  level?: string;
  scenario: string;
};

function getSummaryWindow(
  since: Date,
  moods: MoodSummaryItem[],
  sessions: SessionSummaryItem[],
) {
  const topScenario = getTopScenario(sessions);

  return {
    since: since.toISOString(),
    averageMood: getAverageMood(moods),
    moodCount: moods.length,
    sessionCount: sessions.length,
    topScenario: topScenario
      ? {
          id: topScenario[0],
          count: topScenario[1],
        }
      : null,
    topTags: getTopTags(sessions),
  };
}

function getTopScenario(sessions: SessionSummaryItem[]) {
  const scenarioCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.scenario] = (acc[session.scenario] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(scenarioCounts).sort((a, b) => b[1] - a[1])[0];
}

function getTopTags(sessions: SessionSummaryItem[]) {
  const tagCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    session.activityTags.forEach((tag) => {
      if (activityTags.has(tag)) {
        acc[tag] = (acc[tag] ?? 0) + 1;
      }
    });

    return acc;
  }, {});

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));
}

function getAverageMood(items: MoodSummaryItem[]) {
  return items.length > 0
    ? Number((items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1))
    : null;
}

function getMoodSeries(date: Date, moods: MoodSummaryItem[], days: number) {
  const start = getDaysAgo(date, days - 1);
  const buckets = new Map<string, MoodSummaryItem[]>();

  moods.forEach((mood) => {
    const key = getDateKey(mood.createdAt);
    buckets.set(key, [...(buckets.get(key) ?? []), mood]);
  });

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(start);

    day.setDate(start.getDate() + index);

    const key = getDateKey(day);
    const items = buckets.get(key) ?? [];

    return {
      date: key,
      averageMood: getAverageMood(items),
      count: items.length,
    };
  });
}

function getDaysAgo(date: Date, days: number) {
  const start = new Date(date);

  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return start;
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  weekStart.setDate(weekStart.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);

  return weekStart;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizeActivityTags(tags?: string[]) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return Array.from(
    new Set(tags.map((tag) => String(tag)).filter((tag) => activityTags.has(tag))),
  ).slice(0, 8);
}

function normalizeMoodPeriod(period?: string) {
  return period === 'morning' || period === 'evening' ? period : null;
}

function normalizeScenario(value: string) {
  return value === 'sleep' || value === 'burnout' ? value : 'anxiety';
}

function normalizeIntensity(value: string) {
  return value === 'low' || value === 'high' ? value : 'medium';
}
