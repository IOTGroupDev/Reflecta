import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import OpenAI from 'openai';
import { ChatAttachment, ChatMessageDto, ChatMessageResponse } from './chat.types';
import { PrismaService } from '../prisma/prisma.service';

const suggestions = [
  'Подобрать практику',
  'Разобрать тревогу',
  'Помочь уснуть',
];

const localized = {
  ru: {
    empty: 'Я рядом. Напиши одну фразу о том, что сейчас тяжелее всего.',
    crisis:
      'Мне важно отнестись к этому серьёзно. Если есть риск, что ты можешь причинить вред себе или кому-то ещё, пожалуйста, прямо сейчас обратись к живому человеку рядом или в местные экстренные службы. Не оставайся один: напиши близкому “мне сейчас небезопасно, побудь со мной” и убери от себя всё, чем можно навредить. Я могу остаться рядом текстом, но это не замена срочной помощи.',
    suggestions,
    crisisSuggestions: ['Позвать близкого', 'Местные экстренные службы', 'Остаться не одному'],
    sleep: 'Похоже, день ещё не завершился внутри. Давай не будем заставлять себя спать. На минуту запиши: “что я оставляю до завтра”, потом сделай выдох длиннее вдоха 6 раз.',
    anxiety: 'Похоже, тревога пытается заранее подготовить тебя к плохому варианту. Сейчас важно отделить факт от предположения: что ты точно знаешь, а что мозг достраивает? Начни с одной строки.',
    burnout: 'Звучит так, будто ресурса сейчас мало, и давить на себя сильнее не поможет. Выбери одно дело, которое можно уменьшить или отложить, и дай телу 10 минут без пользы.',
    default: 'Я рядом. Давай сделаем это чуть понятнее: назови одно чувство и одну причину, которая первой приходит в голову. Этого достаточно, чтобы начать.',
    system: 'Отвечай по-русски, коротко, тепло и конкретно.',
  },
  en: {
    empty: 'I am here. Write one sentence about what feels hardest right now.',
    crisis: 'I want to take this seriously. If you might hurt yourself or someone else, please reach a real person nearby or local emergency services right now. Do not stay alone: message someone you trust and move away from anything you could use to hurt yourself. I can stay with you in text, but this is not a replacement for urgent help.',
    suggestions: ['Find a practice', 'Understand anxiety', 'Help me sleep'],
    crisisSuggestions: ['Call someone close', 'Local emergency services', 'Do not stay alone'],
    sleep: 'It sounds like the day has not fully ended inside. Let us not force sleep. Write one line: “what can wait until tomorrow”, then make your exhale longer than your inhale 6 times.',
    anxiety: 'It sounds like anxiety is trying to prepare you for the worst. Right now, separate facts from guesses: what do you know for sure, and what is your mind filling in? Start with one line.',
    burnout: 'It sounds like your energy is low, and pushing harder will not help. Choose one task you can make smaller or move, then give your body 10 minutes with no purpose.',
    default: 'I am here. Let us make this a little clearer: name one feeling and one reason that comes to mind first. That is enough to begin.',
    system: 'Answer in English. Keep it short, warm, concrete and human.',
  },
  es: {
    empty: 'Estoy aquí. Escribe una frase sobre lo que más pesa ahora.',
    crisis: 'Quiero tomar esto en serio. Si podrías hacerte daño o hacer daño a alguien, busca ahora a una persona cercana o a los servicios de emergencia de tu zona. No te quedes solo: escribe a alguien de confianza y aléjate de cualquier cosa con la que podrías hacerte daño. Puedo acompañarte por texto, pero esto no sustituye ayuda urgente.',
    suggestions: ['Buscar una práctica', 'Entender la ansiedad', 'Ayudarme a dormir'],
    crisisSuggestions: ['Llamar a alguien cercano', 'Emergencias locales', 'No quedarme solo'],
    sleep: 'Parece que el día no terminó del todo por dentro. No vamos a forzar el sueño. Escribe una línea: “qué puede esperar hasta mañana”, y luego exhala más largo que inhalas 6 veces.',
    anxiety: 'Parece que la ansiedad intenta prepararte para lo peor. Ahora separa hechos de suposiciones: ¿qué sabes con certeza y qué está completando tu mente? Empieza con una línea.',
    burnout: 'Suena a que tienes poca energía, y exigirte más no va a ayudar. Elige una tarea que puedas hacer más pequeña o mover, y dale al cuerpo 10 minutos sin objetivo.',
    default: 'Estoy aquí. Hagámoslo un poco más claro: nombra una emoción y una razón que aparezca primero. Con eso basta para empezar.',
    system: 'Responde en español. Sé breve, cálido, concreto y humano.',
  },
};

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
    const attachments = normalizeAttachments(dto.attachments);
    const messageWithAttachments = withAttachmentContext(message, attachments);
    const language = dto.language === 'en' || dto.language === 'es' ? dto.language : 'ru';
    const text = localized[language];

    if (!message && attachments.length === 0) {
      const response: ChatMessageResponse = {
        message: text.empty,
        source: 'local',
        suggestions: text.suggestions,
        safety: 'none',
      };
      await this.persist(dto, '', attachments, response);
      return response;
    }

    if (this.isCrisisMessage(message)) {
      const response: ChatMessageResponse = {
        message: text.crisis,
        source: 'local',
        suggestions: text.crisisSuggestions,
        safety: 'crisis',
      };
      await this.persist(dto, message, attachments, response);
      return response;
    }

    if (!this.openai) {
      const response: ChatMessageResponse = {
        message: this.localReply(messageWithAttachments, language),
        source: 'local',
        suggestions: text.suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, attachments, response);
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
              text.system + ' ' +
              'Не называй себя психотерапевтом, не ставь диагнозы, не обещай лечение. ' +
              'Если есть риск самоповреждения или опасности, мягко предложи обратиться за срочной помощью к близким или местным экстренным службам. ' +
              'В конце дай один маленький следующий шаг.',
          },
          ...history,
          { role: 'user', content: messageWithAttachments },
        ],
      });

      const reply: ChatMessageResponse = {
        message: response.output_text,
        source: 'openai',
        suggestions: text.suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, attachments, reply);
      return reply;
    } catch {
      const response: ChatMessageResponse = {
        message: this.localReply(message, language),
        source: 'local',
        suggestions: text.suggestions,
        safety: 'none',
      };
      await this.persist(dto, message, attachments, response);
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
    attachments: ChatAttachment[],
    response: ChatMessageResponse,
  ) {
    const records = [];

    if (userMessage) {
      records.push({
        userId: dto.userId,
        role: 'user',
        content: userMessage,
        attachments: attachments.length > 0 ? attachments as unknown as Prisma.InputJsonValue : undefined,
      });
    }

    records.push({
      userId: dto.userId,
      role: 'assistant',
      content: response.message,
      attachments: undefined,
      source: response.source,
    });

    await this.prisma.chatMessage.createMany({ data: records }).catch(() => undefined);
  }

  private localReply(message: string, language: 'ru' | 'en' | 'es') {
    const lower = message.toLowerCase();
    const text = localized[language];

    if (lower.includes('уснуть') || lower.includes('сон') || lower.includes('спать') || lower.includes('sleep') || lower.includes('dormir')) {
      return text.sleep;
    }

    if (lower.includes('трев') || lower.includes('страш') || lower.includes('боюсь') || lower.includes('anxiety') || lower.includes('ansiedad')) {
      return text.anxiety;
    }

    if (lower.includes('устал') || lower.includes('нет сил') || lower.includes('выгор') || lower.includes('tired') || lower.includes('burnout') || lower.includes('agot')) {
      return text.burnout;
    }

    return text.default;
  }

  private isCrisisMessage(message: string) {
    const lower = message.toLowerCase();
    return crisisPatterns.some((pattern) => lower.includes(pattern));
  }
}

function normalizeAttachments(attachments?: ChatAttachment[]) {
  if (!Array.isArray(attachments)) {
    return [];
  }

  return attachments
    .slice(0, 4)
    .map((attachment) => ({
      id: String(attachment.id).slice(0, 80),
      kind: attachment.kind === 'image' ? 'image' as const : 'document' as const,
      mimeType: attachment.mimeType ? String(attachment.mimeType).slice(0, 120) : undefined,
      name: String(attachment.name || 'attachment').slice(0, 160),
      size: typeof attachment.size === 'number' ? attachment.size : undefined,
      url: String(attachment.url).slice(0, 600),
    }))
    .filter((attachment) => /^https?:\/\//.test(attachment.url));
}

function withAttachmentContext(message: string, attachments: ChatAttachment[]) {
  if (attachments.length === 0) {
    return message;
  }

  const attachmentText = attachments
    .map((attachment) => `${attachment.kind}: ${attachment.name}${attachment.mimeType ? ` (${attachment.mimeType})` : ''}`)
    .join('; ');

  return `${message || 'User sent an attachment.'}\n\nAttachments: ${attachmentText}`;
}
