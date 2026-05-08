import { AnalyzeDto, AnalyzeResult, Scenario } from './ai.types';

export const scenarioLabels: Record<Scenario, string> = {
  anxiety: 'Тревога',
  sleep: 'Сон',
  burnout: 'Выгорание',
};

export function buildLocalResult(dto: AnalyzeDto): AnalyzeResult {
  if (dto.language === 'en') {
    return buildEnglishLocalResult(dto);
  }

  if (dto.language === 'es') {
    return buildSpanishLocalResult(dto);
  }

  const textHint = dto.text ? ` Ты отметил: "${dto.text}".` : '';

  if (dto.scenario === 'sleep') {
    return {
      title: 'Можно мягко снизить напряжение перед сном',
      what:
        'Похоже, тело уже устало, а мысли всё ещё пытаются держать контроль.' +
        textHint,
      why: [
        'день не успел завершиться внутри',
        'мозг продолжает перебирать незакрытые задачи',
        'напряжение мешает телу перейти в режим отдыха',
      ],
      actions: [
        'Запиши одну строку: что можно оставить до завтра.',
        'Положи телефон дальше от кровати на 20 минут.',
        'Выбери один спокойный ритуал: вода, душ или тёплый свет.',
      ],
      relief: {
        title: 'Выдох длиннее вдоха',
        duration: '2 минуты',
        steps: [
          'Вдохни на 4 счёта.',
          'Выдохни на 6 счётов.',
          'Повтори 8 раз, не стараясь уснуть специально.',
        ],
      },
      note: 'Сон чаще приходит не от усилия, а когда мозг перестаёт решать задачи.',
    };
  }

  if (dto.scenario === 'burnout') {
    return {
      title: 'Сейчас важно не давить на себя сильнее',
      what:
        'Это похоже на состояние перегруза, где даже простые дела требуют слишком много сил.' +
        textHint,
      why: [
        'ресурс долго тратился быстрее, чем восстанавливался',
        'могло накопиться слишком много обязательств',
        'мотивация снижается, когда телу нужен отдых',
      ],
      actions: [
        'Выбери одно дело, которое можно уменьшить или перенести.',
        'Сделай список из трёх задач, но начни только с самой маленькой.',
        'Запланируй 20 минут без пользы: восстановление тоже действие.',
      ],
      relief: {
        title: 'Маленькое возвращение в тело',
        duration: '1 минута',
        steps: [
          'Опусти плечи.',
          'Почувствуй стопы на полу.',
          'Назови три предмета вокруг себя.',
        ],
      },
      note: 'Ты не обязан становиться продуктивным прямо сейчас. Сначала нужно вернуть опору.',
    };
  }

  return {
    title: 'Похоже, тебя держит тревога',
    what:
      'Когда нет ясности, мозг начинает достраивать худшие варианты, чтобы вернуть ощущение контроля.' +
      textHint,
    why: [
      'есть неопределённость, которую хочется быстро закрыть',
      'мысли пытаются заранее подготовиться к плохому исходу',
      'напряжение усиливается, когда нет следующего маленького шага',
    ],
    actions: [
      'Выпиши, что известно точно.',
      'Отдельно запиши, что пока только предположение.',
      'Выбери одно маленькое действие на завтра: уточнить задачу, написать сообщение или открыть план дня.',
    ],
    relief: {
      title: 'Дыхание 4-6',
      duration: '30 секунд',
      steps: [
        'Вдохни на 4 счёта.',
        'Выдохни на 6 счётов.',
        'Повтори 5 раз, не споря с мыслями.',
      ],
    },
    note: 'Мысль “всё пойдёт плохо” сейчас не факт, а сигнал тревоги.',
  };
}

function buildEnglishLocalResult(dto: AnalyzeDto): AnalyzeResult {
  const textHint = dto.text ? ` You wrote: "${dto.text}".` : '';

  if (dto.scenario === 'sleep') {
    return {
      title: 'You can lower the tension before sleep',
      what: `Your body may be tired while your mind is still trying to stay in control.${textHint}`,
      why: ['the day has not fully ended inside', 'unfinished tasks are still looping', 'tension keeps the body out of rest'],
      actions: ['Write one thought that can wait until tomorrow.', 'Put the phone farther away for 20 minutes.', 'Make the light softer.'],
      relief: {
        title: 'Longer exhale',
        duration: '2 minutes',
        steps: ['Inhale for 4 counts.', 'Exhale for 6 counts.', 'Repeat 8 times without trying to force sleep.'],
      },
      note: 'Sleep often comes when the mind no longer has to solve the day.',
    };
  }

  if (dto.scenario === 'burnout') {
    return {
      title: 'This is a moment to stop adding pressure',
      what: `This looks like overload, where even simple things take too much energy.${textHint}`,
      why: ['you may have spent energy faster than you could recover', 'too many obligations may have piled up', 'your body needs recovery, not another push'],
      actions: ['Make one task smaller or move it.', 'Start with the smallest piece.', 'Plan 20 minutes with no purpose attached.'],
      relief: {
        title: 'Back to the body',
        duration: '1 minute',
        steps: ['Drop your shoulders.', 'Feel your feet on the floor.', 'Name three things around you.'],
      },
      note: 'You do not have to become productive right now. First, you need ground.',
    };
  }

  return {
    title: 'It sounds like anxiety has a grip on you',
    what: `When things are unclear, the mind fills the gaps with worst-case stories to feel in control.${textHint}`,
    why: ['there is uncertainty you want to close fast', 'your thoughts are trying to prepare for danger', 'tension grows when there is no next small step'],
    actions: ['Write what you know for sure.', 'Write what is only a guess.', 'Choose one small next step for tomorrow.'],
    relief: {
      title: '4-6 breathing',
      duration: '30 seconds',
      steps: ['Inhale for 4 counts.', 'Exhale for 6 counts.', 'Repeat 5 times without arguing with the thoughts.'],
    },
    note: '“Everything will go wrong” is not a fact right now. It is anxiety asking for safety.',
  };
}

function buildSpanishLocalResult(dto: AnalyzeDto): AnalyzeResult {
  const textHint = dto.text ? ` Escribiste: "${dto.text}".` : '';

  if (dto.scenario === 'sleep') {
    return {
      title: 'Puedes bajar la tensión antes de dormir',
      what: `El cuerpo puede estar cansado mientras la mente todavía intenta mantener el control.${textHint}`,
      why: ['el día no terminó del todo por dentro', 'las tareas abiertas siguen dando vueltas', 'la tensión impide que el cuerpo descanse'],
      actions: ['Escribe una idea que puede esperar hasta mañana.', 'Deja el teléfono más lejos durante 20 minutos.', 'Baja un poco la luz.'],
      relief: {
        title: 'Exhalación más larga',
        duration: '2 minutos',
        steps: ['Inhala contando hasta 4.', 'Exhala contando hasta 6.', 'Repite 8 veces sin forzar el sueño.'],
      },
      note: 'El sueño suele llegar cuando la mente ya no tiene que resolver el día.',
    };
  }

  if (dto.scenario === 'burnout') {
    return {
      title: 'Ahora toca dejar de añadir presión',
      what: `Esto se parece a una sobrecarga: hasta lo simple pide demasiada energía.${textHint}`,
      why: ['quizá gastaste energía más rápido de lo que pudiste recuperarla', 'puede que se hayan acumulado demasiadas obligaciones', 'tu cuerpo necesita recuperación, no otro empujón'],
      actions: ['Haz una tarea más pequeña o muévela.', 'Empieza por la parte mínima.', 'Reserva 20 minutos sin objetivo.'],
      relief: {
        title: 'Volver al cuerpo',
        duration: '1 minuto',
        steps: ['Baja los hombros.', 'Siente los pies en el suelo.', 'Nombra tres cosas a tu alrededor.'],
      },
      note: 'No tienes que volverte productivo ahora. Primero necesitas suelo.',
    };
  }

  return {
    title: 'Parece que la ansiedad te está agarrando fuerte',
    what: `Cuando no hay claridad, la mente llena los huecos con historias difíciles para sentir control.${textHint}`,
    why: ['hay incertidumbre que quieres cerrar rápido', 'tus pensamientos intentan prepararte para un peligro', 'la tensión crece cuando no hay un próximo paso pequeño'],
    actions: ['Escribe lo que sabes con certeza.', 'Escribe lo que todavía es una suposición.', 'Elige un siguiente paso pequeño para mañana.'],
    relief: {
      title: 'Respiración 4-6',
      duration: '30 segundos',
      steps: ['Inhala contando hasta 4.', 'Exhala contando hasta 6.', 'Repite 5 veces sin pelear con los pensamientos.'],
    },
    note: '“Todo va a salir mal” no es un hecho ahora. Es la ansiedad pidiendo seguridad.',
  };
}

export const analyzeResultJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    what: { type: 'string' },
    why: {
      type: 'array',
      items: { type: 'string' },
    },
    actions: {
      type: 'array',
      items: { type: 'string' },
    },
    relief: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        duration: { type: 'string' },
        steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['title', 'duration', 'steps'],
    },
    note: { type: 'string' },
  },
  required: ['title', 'what', 'why', 'actions', 'relief', 'note'],
} as const;

export function buildAnalyzePrompt(dto: AnalyzeDto) {
  const scenario = scenarioLabels[dto.scenario];
  const details = dto.details.length > 0 ? dto.details.join(', ') : 'не указаны';
  const tags = dto.activityTags && dto.activityTags.length > 0
    ? dto.activityTags.join(', ')
    : 'не указаны';
  const text = dto.text?.trim() || 'нет';

  return `
Ты пишешь для приложения Reflecta: мягкого AI-помощника для саморефлексии и эмоциональной самопомощи.
Язык ответа: ${dto.language === 'en' ? 'English' : dto.language === 'es' ? 'Spanish' : 'Russian'}.

Сценарий: ${scenario}
Детали: ${details}
Контекстные теги: ${tags}
Интенсивность: ${dto.level}
Комментарий пользователя: ${text}

Тон:
- доброжелательный, спокойный, конкретный
- как "я рядом", но без сюсюканья
- не ставь диагнозы
- не называй себя терапевтом
- не обещай лечение
- не говори "просто убери мысли"

Сформируй короткий разбор:
- title: одна живая фраза
- what: что может происходить сейчас
- why: 2-3 причины простым языком
- actions: 3 маленьких шага, которые реально сделать
- relief: короткая практика на 30 секунд - 3 минуты
- note: одно важное уточнение, которое снижает тревогу
`;
}
