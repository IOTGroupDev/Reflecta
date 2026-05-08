import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateMeDto, UpdatePreferencesDto } from './me.types';

const onboardingGoals = new Set(['calm', 'sleep', 'burnout', 'journal']);

@Injectable()
export class MeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            sessions: true,
            moods: true,
            chats: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      counts: {
        sessions: user._count.sessions,
        moods: user._count.moods,
        chats: user._count.chats,
      },
    };
  }

  async exportData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        sessions: {
          orderBy: { createdAt: 'desc' },
        },
        moods: {
          orderBy: { createdAt: 'desc' },
        },
        chats: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      exportedAt: new Date().toISOString(),
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          }
        : null,
      profile: user?.profile ?? null,
      sessions: user?.sessions ?? [],
      moods: user?.moods ?? [],
      chats: user?.chats ?? [],
    };
  }

  async exportMarkdown(userId: string) {
    const data = await this.exportData(userId);

    return {
      exportedAt: data.exportedAt,
      markdown: buildMarkdownExport(data),
    };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const data = this.normalizePreferences(dto);

    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const name = dto.name === undefined ? undefined : dto.name.trim();
    const avatarUrl = dto.avatarUrl === undefined ? undefined : normalizeAvatarUrl(dto.avatarUrl);

    if (name !== undefined && name.length > 80) {
      throw new BadRequestException('Invalid name');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(name !== undefined ? { name: name || null } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
      },
    });
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    await this.supabase.deleteUser(userId);

    return { deleted: true };
  }

  async deleteData(userId: string) {
    await this.prisma.$transaction([
      this.prisma.chatMessage.deleteMany({ where: { userId } }),
      this.prisma.moodEntry.deleteMany({ where: { userId } }),
      this.prisma.session.deleteMany({ where: { userId } }),
    ]);

    return { deleted: true };
  }

  private normalizePreferences(dto: UpdatePreferencesDto) {
    const data: {
      onboardingGoal?: string;
      timezone?: string;
      dailyReminderEnabled?: boolean;
      dailyReminderTime?: string | null;
      privacyAcceptedAt?: Date;
    } = {};

    if (dto.onboardingGoal !== undefined) {
      if (!onboardingGoals.has(dto.onboardingGoal)) {
        throw new BadRequestException('Invalid onboarding goal');
      }

      data.onboardingGoal = dto.onboardingGoal;
    }

    if (dto.timezone !== undefined) {
      const timezone = dto.timezone.trim();

      if (timezone.length > 80) {
        throw new BadRequestException('Invalid timezone');
      }

      data.timezone = timezone || undefined;
    }

    if (dto.dailyReminderEnabled !== undefined) {
      data.dailyReminderEnabled = Boolean(dto.dailyReminderEnabled);
    }

    if (dto.dailyReminderTime !== undefined) {
      const reminderTime = dto.dailyReminderTime.trim();

      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(reminderTime)) {
        throw new BadRequestException('Invalid reminder time');
      }

      data.dailyReminderTime = reminderTime;
    }

    if (dto.privacyAccepted) {
      data.privacyAcceptedAt = new Date();
    }

    return data;
  }
}

type ExportData = Awaited<ReturnType<MeService['exportData']>>;

function buildMarkdownExport(data: ExportData) {
  const lines = [
    '# Reflecta export',
    '',
    `Exported at: ${data.exportedAt}`,
    data.user?.email ? `Account: ${data.user.email}` : null,
    data.user?.name ? `Name: ${data.user.name}` : null,
    '',
    '## Profile',
    '',
    data.profile?.onboardingGoal ? `- Focus: ${data.profile.onboardingGoal}` : '- Focus: not set',
    data.profile?.timezone ? `- Timezone: ${data.profile.timezone}` : null,
    data.profile?.dailyReminderEnabled
      ? `- Daily reminder: ${data.profile.dailyReminderTime ?? 'enabled'}`
      : '- Daily reminder: off',
    '',
    '## Mood check-ins',
    '',
    ...formatMoods(data.moods),
    '',
    '## Journal',
    '',
    ...formatSessions(data.sessions),
    '',
    '## Chat',
    '',
    ...formatChats(data.chats),
    '',
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

function formatMoods(moods: ExportData['moods']) {
  if (moods.length === 0) {
    return ['No mood check-ins yet.'];
  }

  return moods.map((mood) => {
    const period = mood.period ? ` ${mood.period}` : '';
    const note = mood.note ? ` - ${escapeMarkdown(mood.note)}` : '';

    return `- ${formatDate(mood.createdAt)}${period}: ${mood.rating}/5 (${mood.mood})${note}`;
  });
}

function formatSessions(sessions: ExportData['sessions']) {
  if (sessions.length === 0) {
    return ['No journal entries yet.'];
  }

  return sessions.flatMap((session) => {
    const result = session.result as {
      title?: string;
      what?: string;
      actions?: string[];
      note?: string;
    };

    return [
      `### ${formatDate(session.createdAt)} - ${session.scenario}`,
      '',
      `- Intensity: ${session.level}`,
      session.details.length > 0 ? `- Details: ${session.details.map(escapeMarkdown).join(', ')}` : null,
      session.activityTags.length > 0 ? `- Tags: ${session.activityTags.map(escapeMarkdown).join(', ')}` : null,
      session.text ? `- Note: ${escapeMarkdown(session.text)}` : null,
      '',
      result.title ? `**${escapeMarkdown(result.title)}**` : null,
      result.what ? escapeMarkdown(result.what) : null,
      result.actions && result.actions.length > 0 ? '' : null,
      ...(result.actions?.map((action) => `- ${escapeMarkdown(action)}`) ?? []),
      result.note ? `_${escapeMarkdown(result.note)}_` : null,
      '',
    ].filter((line): line is string => line !== null);
  });
}

function formatChats(chats: ExportData['chats']) {
  if (chats.length === 0) {
    return ['No chat messages yet.'];
  }

  return chats.map((chat) => `- ${formatDate(chat.createdAt)} ${chat.role}: ${escapeMarkdown(chat.content)}`);
}

function formatDate(date: Date) {
  return date.toISOString();
}

function escapeMarkdown(value: string) {
  return value.replace(/([\\`*_{}[\]()#+\-.!|>])/g, '\\$1');
}

function normalizeAvatarUrl(value?: string | null) {
  if (value === null) {
    return null;
  }

  const url = String(value ?? '').trim();

  if (!url) {
    return null;
  }

  if (url.length > 500 || !/^https?:\/\//.test(url)) {
    throw new BadRequestException('Invalid avatar URL');
  }

  return url;
}
