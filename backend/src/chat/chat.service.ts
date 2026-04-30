import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessageDto, ChatMessageResponse } from './chat.types';
import { PrismaService } from '../prisma/prisma.service';

const suggestions = [
  'Подобрать практику',
  'Разобрать тревогу',
  'Помочь уснуть',
];

const crisisSuggestions = [
  'Позвать близкого',
  'Местные экстренные службы',
  'Остаться не одному',
];

const crisisReply =
  'Мне важно отнестись к этому серьёзно. Если есть риск, что ты можешь причинить вред себе или кому-то ещё, пожалуйста, прямо сейчас обратись к живому человеку рядом или в местные экстренные службы. ' +
  'Не оставайся один: напиши близкому “мне сейчас небезопасно, побудь со мной” и убери от себя всё, чем можно навредить. Я могу остаться рядом текстом, но это не замена срочной помощи.';

const crisisPatterns = [
  'суицид',
  'самоуб',
  'умереть',
  'не хочу жить',
  'покончить',
  'убить себя',
  'навредить себе',
  'порезать',
  'порежу',
  'таблетки',
  'выпил таблетки',
  'kill myself',
  'suicide',
  'self harm',
  'hurt myself',
  'end my life',
];

@Injectable()
export class ChatService {
  private readonly openai?: OpenAI;
  private readonly model: string;

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    this.model = config.get<string>('OPENAI_MODEL', 'gpt-4o-mini');

    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async reply(dto: ChatMessageDto): Promise<ChatMessageResponse> {
    const message = dto.message.trim();

    if (!message) {
      const response: ChatMessageResponse = {
        message: 'Я рядом. Напиши одну фразу о том, что сейчас тяжелее всего.',
        source: 'local',
        suggestions,
        safety: 'none',
      };
      await this.persist(dto, '', response);
      return response;
    }

    if (this.isCrisisMessage(message)) {
      const response: ChatMessageResponse = {
        message: crisisReply,
        source: 'local',
        suggestions: crisisSuggestions,
        safety: 'crisis',
      };
      await this.persist(dto, message, response);
      return response;
    }

    if (!this.openai) {
      const response: ChatMessageResponse = {
        message: this.localReply(message),
        source: 'local',
        suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, response);
      return response;
    }

    try {
      const history = (dto.history ?? []).slice(-8).map((turn) => ({
        role: turn.role,
        content: turn.content,
      }));

      const response = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: 'system',
            content:
              'Ты Reflecta, мягкий AI-помощник для саморефлексии. ' +
              'Отвечай по-русски, коротко, тепло и конкретно. ' +
              'Не называй себя психотерапевтом, не ставь диагнозы, не обещай лечение. ' +
              'Если есть риск самоповреждения или опасности, мягко предложи обратиться за срочной помощью к близким или местным экстренным службам. ' +
              'В конце дай один маленький следующий шаг.',
          },
          ...history,
          { role: 'user', content: message },
        ],
      });

      const reply: ChatMessageResponse = {
        message: response.output_text,
        source: 'openai',
        suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, reply);
      return reply;
    } catch {
      const response: ChatMessageResponse = {
        message: this.localReply(message),
        source: 'local',
        suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, response);
      return response;
    }
  }

  async history(userId: string) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  private async persist(
    dto: ChatMessageDto,
    userMessage: string,
    response: ChatMessageResponse,
  ) {
    const records = [];

    if (userMessage) {
      records.push({
        userId: dto.userId,
        role: 'user',
        content: userMessage,
      });
    }

    records.push({
      userId: dto.userId,
      role: 'assistant',
      content: response.message,
      source: response.source,
    });

    await this.prisma.chatMessage.createMany({ data: records }).catch(() => undefined);
  }

  private localReply(message: string) {
    const lower = message.toLowerCase();

    if (lower.includes('уснуть') || lower.includes('сон') || lower.includes('спать')) {
      return (
        'Похоже, день ещё не завершился внутри. Давай не будем заставлять себя спать. ' +
        'На минуту запиши: “что я оставляю до завтра”, потом сделай выдох длиннее вдоха 6 раз.'
      );
    }

    if (lower.includes('трев') || lower.includes('страш') || lower.includes('боюсь')) {
      return (
        'Похоже, тревога пытается заранее подготовить тебя к плохому варианту. ' +
        'Сейчас важно отделить факт от предположения: что ты точно знаешь, а что мозг достраивает? ' +
        'Начни с одной строки.'
      );
    }

    if (lower.includes('устал') || lower.includes('нет сил') || lower.includes('выгор')) {
      return (
        'Звучит так, будто ресурса сейчас мало, и давить на себя сильнее не поможет. ' +
        'Выбери одно дело, которое можно уменьшить или отложить, и дай телу 10 минут без пользы.'
      );
    }

    return (
      'Я рядом. Давай сделаем это чуть понятнее: назови одно чувство и одну причину, ' +
      'которая первой приходит в голову. Этого достаточно, чтобы начать.'
    );
  }

  private isCrisisMessage(message: string) {
    const lower = message.toLowerCase();
    return crisisPatterns.some((pattern) => lower.includes(pattern));
  }
}
