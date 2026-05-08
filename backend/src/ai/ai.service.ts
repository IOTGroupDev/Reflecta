import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ActivityTag,
  AnalyzeDto,
  AnalyzeResponse,
  AnalyzeResult,
  WeeklySummaryInput,
  WeeklySummaryResponse,
} from './ai.types';
import {
  analyzeResultJsonSchema,
  buildAnalyzePrompt,
  buildLocalResult,
} from './scenarios';

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
export class AiService {
  private readonly deepseek?: OpenAI;
  private readonly deepseekModel: string;
  private readonly openai?: OpenAI;
  private readonly provider: 'deepseek' | 'openai' | 'local';
  private readonly model: string;

  constructor(config: ConfigService) {
    const provider = config.get<string>('AI_PROVIDER', 'openai').toLowerCase();
    const deepseekApiKey = config.get<string>('DEEPSEEK_API_KEY');
    const deepseekBaseUrl = config.get<string>('DEEPSEEK_BASE_URL', 'https://api.deepseek.com');
    const openaiApiKey = config.get<string>('OPENAI_API_KEY');

    this.deepseekModel = config.get<string>('DEEPSEEK_MODEL', 'deepseek-v4-flash');
    this.model = config.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
    this.provider =
      provider === 'deepseek' && deepseekApiKey
        ? 'deepseek'
        : provider === 'openai' && openaiApiKey
          ? 'openai'
          : 'local';

    if (deepseekApiKey) {
      this.deepseek = new OpenAI({
        apiKey: deepseekApiKey,
        baseURL: deepseekBaseUrl,
      });
    }

    if (openaiApiKey) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
  }

  async analyze(dto: AnalyzeDto): Promise<AnalyzeResponse> {
    const safeDto = this.normalizeDto(dto);

    if (this.provider === 'local') {
      return {
        result: buildLocalResult(safeDto),
        source: 'local',
      };
    }

    try {
      if (this.provider === 'deepseek' && this.deepseek) {
        return {
          result: await this.deepseekJson<AnalyzeResult>(buildAnalyzePrompt(safeDto)),
          source: 'deepseek',
        };
      }

      return {
        result: await this.openaiJson<AnalyzeResult>(buildAnalyzePrompt(safeDto), {
          name: 'reflecta_analysis',
          schema: analyzeResultJsonSchema,
        }),
        source: 'openai',
      };
    } catch {
      return {
        result: buildLocalResult(safeDto),
        source: 'local',
      };
    }
  }

  async summarizeWeek(input: WeeklySummaryInput): Promise<WeeklySummaryResponse> {
    const safeInput = normalizeWeeklySummaryInput(input);

    if (this.provider === 'local') {
      return {
        source: 'local',
        summary: buildLocalWeeklySummary(safeInput),
      };
    }

    try {
      if (this.provider === 'deepseek' && this.deepseek) {
        return {
          source: 'deepseek',
          summary: await this.deepseekJson<WeeklySummaryResponse['summary']>(
            buildWeeklySummaryPrompt(safeInput),
          ),
        };
      }

      return {
        source: 'openai',
        summary: await this.openaiJson<WeeklySummaryResponse['summary']>(
          buildWeeklySummaryPrompt(safeInput),
          {
            name: 'reflecta_weekly_summary',
            schema: weeklySummaryJsonSchema,
          },
        ),
      };
    } catch {
      return {
        source: 'local',
        summary: buildLocalWeeklySummary(safeInput),
      };
    }
  }

  private async openaiJson<T>(
    input: string,
    format: { name: string; schema: Record<string, unknown> },
  ) {
    if (!this.openai) {
      throw new Error('OpenAI client is not configured');
    }

    const response = await this.openai.responses.create({
      model: this.model,
      input,
      text: {
        format: {
          type: 'json_schema',
          name: format.name,
          strict: true,
          schema: format.schema,
        },
      },
    });

    return JSON.parse(response.output_text) as T;
  }

  private async deepseekJson<T>(prompt: string) {
    if (!this.deepseek) {
      throw new Error('DeepSeek client is not configured');
    }

    const response = await this.deepseek.chat.completions.create({
      model: this.deepseekModel,
      messages: [
        {
          role: 'system',
          content: 'Return only valid JSON. Do not include markdown or extra text.',
        },
        {
          role: 'user',
          content: `${prompt}\n\nReturn a valid JSON object.`,
        },
      ],
      response_format: { type: 'json_object' },
    });
    const content = response.choices[0]?.message.content;

    if (!content) {
      throw new Error('DeepSeek returned empty content');
    }

    return JSON.parse(content) as T;
  }

  private normalizeDto(dto: AnalyzeDto): AnalyzeDto {
    if (!['anxiety', 'sleep', 'burnout'].includes(dto.scenario)) {
      throw new BadRequestException('Invalid scenario');
    }

    if (!['low', 'medium', 'high'].includes(dto.level)) {
      throw new BadRequestException('Invalid level');
    }

    const details = Array.isArray(dto.details)
      ? dto.details.slice(0, 8).map((item) => String(item).slice(0, 80))
      : [];
    const tags = Array.isArray(dto.activityTags)
      ? dto.activityTags
          .map((item) => String(item))
          .filter(isActivityTag)
          .slice(0, 8)
      : [];
    const text = dto.text ? String(dto.text).trim().slice(0, 1200) : undefined;
    const language = ['ru', 'en', 'es'].includes(String(dto.language))
      ? dto.language
      : 'ru';

    return {
      ...dto,
      activityTags: tags,
      details,
      language,
      text,
    };
  }
}

function isActivityTag(value: string): value is ActivityTag {
  return activityTags.has(value);
}

const weeklySummaryJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    pattern: { type: 'string' },
    helped: {
      type: 'array',
      items: { type: 'string' },
    },
    next: {
      type: 'array',
      items: { type: 'string' },
    },
    caution: { type: 'string' },
  },
  required: ['title', 'pattern', 'helped', 'next', 'caution'],
} as const;

function normalizeWeeklySummaryInput(input: WeeklySummaryInput): WeeklySummaryInput {
  const language = ['ru', 'en', 'es'].includes(String(input.language))
    ? input.language
    : 'ru';

  return {
    language,
    moodSeries: Array.isArray(input.moodSeries) ? input.moodSeries.slice(-14) : [],
    topTags: Array.isArray(input.topTags) ? input.topTags.slice(0, 5) : [],
    highIntensityTags: Array.isArray(input.highIntensityTags)
      ? input.highIntensityTags.slice(0, 5)
      : [],
    sessions: Array.isArray(input.sessions)
      ? input.sessions.slice(0, 10).map((session) => ({
          scenario: session.scenario,
          level: session.level,
          details: session.details.slice(0, 8),
          activityTags: session.activityTags.slice(0, 8),
          text: session.text ? session.text.slice(0, 240) : null,
          createdAt: session.createdAt,
        }))
      : [],
  };
}

function buildWeeklySummaryPrompt(input: WeeklySummaryInput) {
  const language = input.language === 'en' ? 'English' : input.language === 'es' ? 'Spanish' : 'Russian';

  return `
You write for Reflecta, a gentle self-reflection and emotional self-care app.
Response language: ${language}.

Data:
Mood series: ${JSON.stringify(input.moodSeries)}
Common context tags: ${JSON.stringify(input.topTags)}
High-intensity context tags: ${JSON.stringify(input.highIntensityTags)}
Recent reflections: ${JSON.stringify(input.sessions)}

Rules:
- Do not diagnose.
- Do not claim treatment.
- Be concrete and calm.
- Focus on patterns, what helped, and one small next step.
- If data is sparse, say that gently.

Return JSON:
- title: short weekly title
- pattern: one paragraph about the visible pattern
- helped: 2-3 short bullets
- next: 2-3 small actions for next week
- caution: one sentence about not over-interpreting limited data
`;
}

function buildLocalWeeklySummary(input: WeeklySummaryInput): WeeklySummaryResponse['summary'] {
  const hasMood = input.moodSeries.some((point) => point.averageMood !== null);
  const topTag = input.topTags[0]?.id;
  const highTag = input.highIntensityTags[0]?.id;

  if (input.language === 'en') {
    return {
      title: 'A small weekly pattern',
      pattern: hasMood
        ? `Your check-ins are starting to show a rhythm${topTag ? ` around ${topTag}` : ''}.`
        : 'There is not enough mood data yet, but your saved reflections can still guide the next small step.',
      helped: ['Short practices gave the week clearer anchors.', 'Saving reflections makes repeated contexts easier to notice.'],
      next: ['Keep one morning or evening check-in.', highTag ? `Watch ${highTag} when intensity rises.` : 'Add tags to a few more reflections.'],
      caution: 'Treat this as a gentle signal, not a diagnosis or fixed conclusion.',
    };
  }

  if (input.language === 'es') {
    return {
      title: 'Un pequeño patrón semanal',
      pattern: hasMood
        ? `Tus check-ins empiezan a mostrar un ritmo${topTag ? ` alrededor de ${topTag}` : ''}.`
        : 'Todavía hay pocos datos de ánimo, pero las reflexiones guardadas ya pueden orientar el siguiente paso.',
      helped: ['Las prácticas cortas dieron puntos de apoyo.', 'Guardar reflexiones ayuda a notar contextos repetidos.'],
      next: ['Mantén un check-in por la mañana o por la noche.', highTag ? `Observa ${highTag} cuando suba la intensidad.` : 'Añade etiquetas a algunas reflexiones más.'],
      caution: 'Tómalo como una señal suave, no como diagnóstico ni conclusión fija.',
    };
  }

  return {
    title: 'Маленький паттерн недели',
    pattern: hasMood
      ? `Check-in уже начинают показывать ритм${topTag ? ` вокруг ${topTag}` : ''}.`
      : 'Данных по настроению пока мало, но сохранённые разборы уже могут подсказать следующий маленький шаг.',
    helped: ['Короткие практики дают неделе точки опоры.', 'Сохранённые разборы помогают заметить повторяющиеся контексты.'],
    next: ['Оставь один утренний или вечерний check-in.', highTag ? `Отслеживай ${highTag}, когда интенсивность растёт.` : 'Добавь теги к ещё нескольким разборам.'],
    caution: 'Это мягкий сигнал для самонаблюдения, а не диагноз и не окончательный вывод.',
  };
}
