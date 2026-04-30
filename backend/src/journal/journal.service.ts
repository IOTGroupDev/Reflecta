import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaveMoodDto, SaveSessionDto } from './journal.types';

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
        level: dto.level,
        text: dto.text,
        result: dto.result as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async saveMood(dto: SaveMoodDto) {
    return this.prisma.moodEntry.create({
      data: {
        userId: dto.userId,
        mood: dto.mood,
        rating: dto.rating,
        note: dto.note,
      },
    });
  }

  async summary(userId: string) {
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
    };
  }
}
