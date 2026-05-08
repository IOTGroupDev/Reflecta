import type {
  AnalyzeResult,
  ActivityTag,
  Intensity,
  Language,
  OnboardingGoal,
  PracticePlan,
  Scenario,
  ScenarioId,
} from './types';

export const languages: Array<{ id: Language; label: string; short: string }> = [
  { id: 'ru', label: 'Русский', short: 'RU' },
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'es', label: 'Español', short: 'ES' },
];

type Copy = {
  account: {
    title: string;
    note: string;
    data: string;
    goal: string;
    noGoal: string;
    records: (sessions: number, moods: number, chats: number) => string;
    rhythm: string;
    reminderOn: (time: string) => string;
    reminderOff: string;
    on: string;
    off: string;
    close: string;
    exportData: string;
    exportMarkdown: string;
    clearData: string;
    signOut: string;
    deleteAccount: string;
  };
  profile: {
    title: string;
    subtitle: string;
    signedIn: string;
    focus: string;
    chooseFocus: string;
    stats: string;
    sessions: string;
    moods: string;
    chats: string;
    reminder: string;
    reminderHintOn: (time: string) => string;
    reminderHintOff: string;
    reminderTime: string;
    language: string;
    privacy: string;
    privacyText: string;
    displayName: string;
    displayNamePlaceholder: string;
    uploadAvatar: string;
    timezone: string;
    timezonePlaceholder: string;
    saveIdentity: string;
    privacyLock: string;
    privacyLockText: string;
    privacyLockPlaceholder: string;
    enablePrivacyLock: string;
    disablePrivacyLock: string;
  };
  privacyLock: {
    title: string;
    text: string;
    placeholder: string;
    unlock: string;
    unlockBiometric: string;
    wrongPin: string;
    invalidPin: string;
    enabled: string;
    disabled: string;
  };
  alerts: {
    cancel: string;
    delete: string;
    clear: string;
    deleteAccountTitle: string;
    deleteAccountBody: string;
    clearDataTitle: string;
    clearDataBody: string;
    deleteFailed: string;
    clearFailed: string;
    saveFailed: string;
    exportFailed: string;
    sessionNotReady: string;
    done: string;
    dataCleared: string;
    saved: string;
    journalSaved: string;
    practiceSaved: string;
    needSignIn: string;
    signInToAnalyze: string;
    saveNeedsSignIn: string;
  };
  auth: {
    checking: string;
    private: string;
    title: string;
    text: string;
    practiceValue: string;
    practiceLabel: string;
    quietValue: string;
    quietLabel: string;
    formTitleSent: string;
    formTitleIdle: string;
    formTextSent: string;
    formTextIdle: string;
    codePlaceholder: string;
    submitSent: string;
    submitIdle: string;
    resendIn: (time: string) => string;
    resend: string;
    footnote: string;
  };
  chat: {
    title: string;
    subtitle: string;
    urgentTitle: string;
    urgentText: string;
    anxiety: string;
    sleep: string;
    practice: string;
    urgent: string;
    anxietyPrompt: string;
    sleepPrompt: string;
    placeholder: string;
    attach: string;
    attachDocument: string;
    attachPhoto: string;
    attachmentFailed: string;
    welcome: string;
    offline: string;
  };
  common: {
    next: string;
    continue: string;
    start: string;
    later: string;
    save: string;
    newAnalysis: string;
    analysis: string;
    practice: string;
    practiceCompleted: (title: string) => string;
    practiceReason: string;
    journal: string;
  };
  home: {
    kicker: string;
    title: string;
    titleWithName: (name: string) => string;
    openPractice: string;
    talkTitle: string;
    talkText: string;
    safetyTitle: string;
    safetyText: string;
    moodTitle: string;
    moodHint: string;
    morning: string;
    evening: string;
    moodNotePlaceholder: string;
    rhythmKicker: string;
    rhythmSteps: (done: number) => string;
    rhythmDone: string;
    rhythmMoodDone: string;
    rhythmStart: string;
    repeat: string;
    rhythmPanel: string;
    rhythmClosed: string;
    rhythmOneLeft: string;
    rhythmOneTouch: string;
    rhythmTextDone: string;
    rhythmTextMood: (scenario: string) => string;
    rhythmTextEmpty: string;
    time: string;
    today: string;
    touches: string;
    focus: string;
    nextStep: string;
    repeatPractice: string;
    quickHelp: string;
    quickHelpHint: string;
    memoryTitle: string;
    lastEntry: string;
    lastEntryText: (date: string, scenario: string) => string;
    memoryText: string;
  };
  flow: {
    detailsTitle: string;
    detailsHint: string;
    intensityTitle: string;
    noteTitle: string;
    noteHint: string;
    notePlaceholder: string;
    activityTitle: string;
    activityHint: string;
    activityTags: Record<ActivityTag, string>;
    analyze: string;
  };
  insights: {
    title: string;
    subtitle: string;
    average: string;
    averageBasedOn: (count: number) => string;
    averageEmpty: string;
    analyses: string;
    mostOften: string;
    visible: string;
    visibleScenario: (scenario: string) => string;
    visibleEmpty: string;
    practiceFor: (scenario: string) => string;
    startAnxiety: string;
    thisWeek: string;
    weekTouches: string;
    weekMood: string;
    weekMoodDelta: (delta: number) => string;
    weekMoodFlat: string;
    weekMoodEmpty: string;
    latestCheckIn: string;
    latestCheckInText: (period: string, rating: number) => string;
    moodChart: string;
    moodChartEmpty: string;
    aiSummary: string;
    aiSummaryButton: string;
    aiSummaryHelped: string;
    aiSummaryNext: string;
    aiSummaryEmpty: string;
    sevenDays: string;
    thirtyDays: string;
    moodShort: string;
    notesShort: string;
    trendEmpty: string;
    contexts: string;
    highIntensityContexts: string;
    contextsEmpty: string;
  };
  journal: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyText: string;
    practice: string;
    analysis: string;
    all: string;
    allStates: string;
    filteredEmptyTitle: string;
    filteredEmptyText: string;
    entriesCount: (count: number) => string;
    note: string;
    open: string;
    close: string;
    deleteEntry: string;
    deleteEntryTitle: string;
    deleteEntryBody: string;
    deleteEntryFailed: string;
    calendar: string;
    selectedDayEmpty: string;
    searchPlaceholder: string;
  };
  onboarding: {
    kicker: string;
    title: string;
    text: string;
    safety: string;
    goals: Record<OnboardingGoal, { title: string; text: string; label: string }>;
  };
  practices: {
    title: string;
    subtitle: string;
    complete: string;
  };
  result: {
    what: string;
    why: string;
    steps: string;
    now: string;
  };
  safety: {
    title: string;
    text: string;
    step1: string;
    step2: string;
    step3: string;
    note: string;
    understood: string;
  };
  nav: Record<'today' | 'chat' | 'practices' | 'journal' | 'insights' | 'profile', string>;
  authMessages: {
    missingEnv: string;
    enterEmail: string;
    enterCode: string;
    openLinkFailed: string;
    codeFailed: string;
    sendFailed: string;
    tooMany: string;
    invalidEmail: string;
    sent: (time: string) => string;
    sentNoRedirect: (time: string) => string;
    resendWait: (time: string) => string;
    tooManyWait: (time: string) => string;
    sendFailedWithMessage: (message: string) => string;
    seconds: (seconds: number) => string;
    minutes: (minutes: number, seconds: number) => string;
  };
  notification: {
    body: string;
    channel: string;
  };
};

const scenarioCopy: Record<Language, Record<ScenarioId, Omit<Scenario, 'id' | 'icon' | 'color'>>> = {
  ru: {
    anxiety: {
      title: 'Тревога',
      subtitle: 'Мысли крутятся, сложно выдохнуть',
      details: [
        { id: 'overthinking', label: 'Накручиваю мысли' },
        { id: 'future', label: 'Боюсь будущего' },
        { id: 'body', label: 'Тревога в теле' },
        { id: 'work', label: 'Из-за работы' },
      ],
    },
    sleep: {
      title: 'Не могу уснуть',
      subtitle: 'День закончился, а голова всё ещё работает',
      details: [
        { id: 'thoughts', label: 'Много мыслей' },
        { id: 'phone', label: 'Залипаю в телефон' },
        { id: 'tension', label: 'Тело напряжено' },
        { id: 'tomorrow', label: 'Думаю о завтра' },
      ],
    },
    burnout: {
      title: 'Нет сил',
      subtitle: 'Даже простое кажется слишком тяжёлым',
      details: [
        { id: 'no_energy', label: 'Нет энергии' },
        { id: 'irritation', label: 'Раздражает почти всё' },
        { id: 'pressure', label: 'Слишком много дел' },
        { id: 'empty', label: 'Ничего не хочется' },
      ],
    },
  },
  en: {
    anxiety: {
      title: 'Anxiety',
      subtitle: 'Your thoughts are racing and it is hard to breathe out',
      details: [
        { id: 'overthinking', label: 'I keep overthinking' },
        { id: 'future', label: 'The future feels scary' },
        { id: 'body', label: 'I feel it in my body' },
        { id: 'work', label: 'Work is pressing on me' },
      ],
    },
    sleep: {
      title: 'Can’t sleep',
      subtitle: 'The day is over, but your mind is still on',
      details: [
        { id: 'thoughts', label: 'Too many thoughts' },
        { id: 'phone', label: 'I keep reaching for my phone' },
        { id: 'tension', label: 'My body is tense' },
        { id: 'tomorrow', label: 'Tomorrow is on my mind' },
      ],
    },
    burnout: {
      title: 'No energy',
      subtitle: 'Even small things feel too heavy',
      details: [
        { id: 'no_energy', label: 'I feel drained' },
        { id: 'irritation', label: 'Almost everything irritates me' },
        { id: 'pressure', label: 'There is too much to carry' },
        { id: 'empty', label: 'I do not want anything' },
      ],
    },
  },
  es: {
    anxiety: {
      title: 'Ansiedad',
      subtitle: 'Los pensamientos no paran y cuesta soltar el aire',
      details: [
        { id: 'overthinking', label: 'Le doy vueltas a todo' },
        { id: 'future', label: 'El futuro me asusta' },
        { id: 'body', label: 'Lo siento en el cuerpo' },
        { id: 'work', label: 'El trabajo me pesa' },
      ],
    },
    sleep: {
      title: 'No puedo dormir',
      subtitle: 'El día terminó, pero la mente sigue encendida',
      details: [
        { id: 'thoughts', label: 'Demasiados pensamientos' },
        { id: 'phone', label: 'Vuelvo al teléfono una y otra vez' },
        { id: 'tension', label: 'Tengo el cuerpo tenso' },
        { id: 'tomorrow', label: 'Pienso en mañana' },
      ],
    },
    burnout: {
      title: 'Sin energía',
      subtitle: 'Hasta lo pequeño se siente demasiado',
      details: [
        { id: 'no_energy', label: 'Estoy sin fuerzas' },
        { id: 'irritation', label: 'Casi todo me irrita' },
        { id: 'pressure', label: 'Cargo demasiadas cosas' },
        { id: 'empty', label: 'No me apetece nada' },
      ],
    },
  },
};

const scenarioMeta: Record<ScenarioId, Pick<Scenario, 'id' | 'icon' | 'color'>> = {
  anxiety: { id: 'anxiety', icon: '!', color: '#ff9b72' },
  sleep: { id: 'sleep', icon: 'z', color: '#6f9df6' },
  burnout: { id: 'burnout', icon: '~', color: '#7cc4ad' },
};

export const intensityByLanguage: Record<Language, Array<{ id: Intensity; label: string; helper: string }>> = {
  ru: [
    { id: 'low', label: 'Немного', helper: 'заметно, но я держусь' },
    { id: 'medium', label: 'Сильно', helper: 'мешает быть в обычном ритме' },
    { id: 'high', label: 'Накрывает', helper: 'нужна опора прямо сейчас' },
  ],
  en: [
    { id: 'low', label: 'A little', helper: 'I notice it, but I can hold it' },
    { id: 'medium', label: 'Strong', helper: 'It is getting in the way' },
    { id: 'high', label: 'Overwhelming', helper: 'I need support right now' },
  ],
  es: [
    { id: 'low', label: 'Un poco', helper: 'lo noto, pero puedo sostenerlo' },
    { id: 'medium', label: 'Fuerte', helper: 'ya me está afectando el día' },
    { id: 'high', label: 'Me supera', helper: 'necesito apoyo ahora mismo' },
  ],
};

export const practicePlansByLanguage: Record<Language, Record<ScenarioId, PracticePlan>> = {
  ru: {
    anxiety: {
      title: 'Снять первый слой тревоги',
      duration: '90 секунд',
      setup: 'Сядь устойчиво. Не нужно успокаиваться идеально, достаточно чуть снизить шум.',
      steps: [
        'Вдохни спокойно на 4 счёта.',
        'Выдохни длиннее, на 6 счётов.',
        'Назови один факт, который точно известен.',
        'Выбери один маленький следующий шаг.',
      ],
      after: 'Если внутри стало хотя бы немного тише, этого уже достаточно на сейчас.',
    },
    sleep: {
      title: 'Мягко закрыть день',
      duration: '2 минуты',
      setup: 'Уменьши свет, отложи телефон и дай телу понять: сегодня больше не надо решать.',
      steps: [
        'Сделай длинный выдох.',
        'Расслабь челюсть и плечи.',
        'Запиши одну мысль, которую можно оставить до завтра.',
        'Скажи себе: сейчас можно отдыхать.',
      ],
      after: 'Сон чаще приходит не от усилия, а когда день наконец получает точку.',
    },
    burnout: {
      title: 'Вернуть немного воздуха',
      duration: '3 минуты',
      setup: 'Цель не собраться. Цель - перестать давить на себя ещё сильнее.',
      steps: [
        'Положи руку на грудь или живот.',
        'Назови три вещи, которые можно не делать прямо сейчас.',
        'Выбери одно дело, которое можно уменьшить.',
        'Запланируй 20 минут без пользы сегодня или завтра.',
      ],
      after: 'Выгорание не чинится усилием. Сначала нужно вернуть себе место.',
    },
  },
  en: {
    anxiety: {
      title: 'Ease the first layer of anxiety',
      duration: '90 seconds',
      setup: 'Sit steady. You do not have to feel perfectly calm; a little more space is enough.',
      steps: [
        'Breathe in gently for 4 counts.',
        'Breathe out longer, for 6 counts.',
        'Name one thing you know for sure.',
        'Choose one small next step.',
      ],
      after: 'If it feels even a little quieter inside, that counts for now.',
    },
    sleep: {
      title: 'Let the day end',
      duration: '2 minutes',
      setup: 'Dim the light, put the phone away, and let your body know there is nothing to solve now.',
      steps: [
        'Take one long exhale.',
        'Soften your jaw and shoulders.',
        'Write down one thought that can wait until tomorrow.',
        'Tell yourself: I can rest now.',
      ],
      after: 'Sleep often comes when the day finally gets a full stop.',
    },
    burnout: {
      title: 'Get a little air back',
      duration: '3 minutes',
      setup: 'The goal is not to push harder. The goal is to stop adding pressure.',
      steps: [
        'Put one hand on your chest or belly.',
        'Name three things you do not have to do right now.',
        'Choose one task you can make smaller.',
        'Plan 20 minutes with no usefulness attached.',
      ],
      after: 'Burnout is not fixed by force. First, you need a little room again.',
    },
  },
  es: {
    anxiety: {
      title: 'Bajar la primera capa de ansiedad',
      duration: '90 segundos',
      setup: 'Siéntate con apoyo. No hace falta calmarte perfecto; un poco más de espacio alcanza.',
      steps: [
        'Inhala suave contando hasta 4.',
        'Exhala más largo, contando hasta 6.',
        'Nombra algo que sabes con certeza.',
        'Elige un siguiente paso pequeño.',
      ],
      after: 'Si por dentro hay un poco menos de ruido, por ahora ya cuenta.',
    },
    sleep: {
      title: 'Dejar que el día termine',
      duration: '2 minutos',
      setup: 'Baja la luz, deja el teléfono y dile al cuerpo: ahora no hay nada que resolver.',
      steps: [
        'Haz una exhalación larga.',
        'Afloja la mandíbula y los hombros.',
        'Escribe una idea que puede esperar hasta mañana.',
        'Repite: ahora puedo descansar.',
      ],
      after: 'El sueño suele llegar cuando el día por fin encuentra un punto final.',
    },
    burnout: {
      title: 'Recuperar un poco de aire',
      duration: '3 minutos',
      setup: 'La meta no es exigirte más. La meta es dejar de apretarte.',
      steps: [
        'Pon una mano en el pecho o en el abdomen.',
        'Nombra tres cosas que no tienes que hacer ahora.',
        'Elige una tarea que puedas hacer más pequeña.',
        'Reserva 20 minutos sin tener que ser útil.',
      ],
      after: 'El agotamiento no se arregla con fuerza. Primero necesitas volver a tener espacio.',
    },
  },
};

export const fallbackResultsByLanguage: Record<Language, Record<ScenarioId, AnalyzeResult>> = {
  ru: {
    anxiety: {
      title: 'Похоже, тебя держит тревога',
      what: 'Когда нет ясности, мозг начинает достраивать худшие варианты, чтобы вернуть ощущение контроля.',
      why: [
        'есть неопределённость, которую хочется быстро закрыть',
        'мысли пытаются заранее подготовиться к плохому исходу',
        'напряжение усиливается, когда нет следующего маленького шага',
      ],
      actions: ['Отдели факты от предположений.', 'Запиши один следующий шаг.', 'Вернись к дыханию на 30 секунд.'],
      relief: {
        title: 'Дыхание 4-6',
        duration: '30 секунд',
        steps: ['Вдохни на 4 счёта.', 'Выдохни на 6 счётов.', 'Повтори 5 раз.'],
      },
      note: 'Мысль “всё пойдёт плохо” сейчас не факт, а сигнал тревоги.',
    },
    sleep: {
      title: 'Можно мягко снизить напряжение перед сном',
      what: 'Тело уже устало, а мысли всё ещё пытаются держать контроль.',
      why: ['день не успел завершиться внутри', 'мозг перебирает незакрытые задачи', 'напряжение мешает телу перейти в отдых'],
      actions: ['Запиши одну мысль на завтра.', 'Убери телефон подальше.', 'Сделай свет тише.'],
      relief: {
        title: 'Выдох длиннее вдоха',
        duration: '2 минуты',
        steps: ['Вдохни на 4 счёта.', 'Выдохни на 6 счётов.', 'Повтори 8 раз.'],
      },
      note: 'Сон чаще приходит не от усилия, а когда мозг перестаёт решать задачи.',
    },
    burnout: {
      title: 'Сейчас важно не давить на себя сильнее',
      what: 'Это похоже на перегруз, где даже простые дела требуют слишком много сил.',
      why: ['ресурс долго тратился быстрее, чем восстанавливался', 'накопилось слишком много обязательств', 'телу нужен не рывок, а восстановление'],
      actions: ['Уменьши одно дело.', 'Начни с самой маленькой части.', 'Запланируй 20 минут без пользы.'],
      relief: {
        title: 'Вернуться в тело',
        duration: '1 минута',
        steps: ['Опусти плечи.', 'Почувствуй стопы на полу.', 'Назови три предмета вокруг.'],
      },
      note: 'Ты не обязан становиться продуктивным прямо сейчас. Сначала нужно вернуть опору.',
    },
  },
  en: {
    anxiety: {
      title: 'It sounds like anxiety has a grip on you',
      what: 'When things are unclear, the mind fills the gaps with worst-case stories to feel in control.',
      why: ['there is uncertainty you want to close fast', 'your thoughts are trying to prepare for danger', 'tension grows when there is no next small step'],
      actions: ['Separate facts from guesses.', 'Write down one next step.', 'Come back to your breath for 30 seconds.'],
      relief: {
        title: '4-6 breathing',
        duration: '30 seconds',
        steps: ['Inhale for 4 counts.', 'Exhale for 6 counts.', 'Repeat 5 times.'],
      },
      note: '“Everything will go wrong” is not a fact right now. It is anxiety asking for safety.',
    },
    sleep: {
      title: 'You can lower the tension before sleep',
      what: 'Your body is tired, but your mind is still trying to stay in charge.',
      why: ['the day has not fully ended inside', 'unfinished tasks are still looping', 'tension keeps the body out of rest'],
      actions: ['Write one thought for tomorrow.', 'Put the phone farther away.', 'Make the light softer.'],
      relief: {
        title: 'Longer exhale',
        duration: '2 minutes',
        steps: ['Inhale for 4 counts.', 'Exhale for 6 counts.', 'Repeat 8 times.'],
      },
      note: 'Sleep often comes when the mind no longer has to solve the day.',
    },
    burnout: {
      title: 'This is a moment to stop adding pressure',
      what: 'This looks like overload, where even simple things take too much.',
      why: ['you may have spent energy faster than you could recover', 'too many obligations may have piled up', 'your body needs recovery, not another push'],
      actions: ['Make one task smaller.', 'Start with the smallest piece.', 'Plan 20 minutes with no purpose.'],
      relief: {
        title: 'Back to the body',
        duration: '1 minute',
        steps: ['Drop your shoulders.', 'Feel your feet on the floor.', 'Name three things around you.'],
      },
      note: 'You do not have to become productive right now. First, you need ground.',
    },
  },
  es: {
    anxiety: {
      title: 'Parece que la ansiedad te está agarrando fuerte',
      what: 'Cuando no hay claridad, la mente llena los huecos con historias difíciles para sentir control.',
      why: ['hay incertidumbre que quieres cerrar rápido', 'tus pensamientos intentan prepararte para un peligro', 'la tensión crece cuando no hay un próximo paso pequeño'],
      actions: ['Separa hechos de suposiciones.', 'Escribe un siguiente paso.', 'Vuelve a la respiración durante 30 segundos.'],
      relief: {
        title: 'Respiración 4-6',
        duration: '30 segundos',
        steps: ['Inhala contando hasta 4.', 'Exhala contando hasta 6.', 'Repite 5 veces.'],
      },
      note: '“Todo va a salir mal” no es un hecho ahora. Es la ansiedad pidiendo seguridad.',
    },
    sleep: {
      title: 'Puedes bajar la tensión antes de dormir',
      what: 'El cuerpo está cansado, pero la mente todavía intenta mantener el control.',
      why: ['el día no terminó del todo por dentro', 'las tareas abiertas siguen dando vueltas', 'la tensión impide que el cuerpo descanse'],
      actions: ['Escribe una idea para mañana.', 'Deja el teléfono más lejos.', 'Baja un poco la luz.'],
      relief: {
        title: 'Exhalación más larga',
        duration: '2 minutos',
        steps: ['Inhala contando hasta 4.', 'Exhala contando hasta 6.', 'Repite 8 veces.'],
      },
      note: 'El sueño suele llegar cuando la mente ya no tiene que resolver el día.',
    },
    burnout: {
      title: 'Ahora toca dejar de añadir presión',
      what: 'Esto se parece a una sobrecarga: hasta lo simple pide demasiada energía.',
      why: ['quizá gastaste energía más rápido de lo que pudiste recuperarla', 'puede que se hayan acumulado demasiadas obligaciones', 'tu cuerpo necesita recuperación, no otro empujón'],
      actions: ['Haz una tarea más pequeña.', 'Empieza por la parte mínima.', 'Reserva 20 minutos sin objetivo.'],
      relief: {
        title: 'Volver al cuerpo',
        duration: '1 minuto',
        steps: ['Baja los hombros.', 'Siente los pies en el suelo.', 'Nombra tres cosas a tu alrededor.'],
      },
      note: 'No tienes que volverte productivo ahora. Primero necesitas suelo.',
    },
  },
};

export const copy: Record<Language, Copy> = {
  ru: {
    account: {
      title: 'Аккаунт',
      note: 'Здесь можно забрать свои записи, настроить напоминание или удалить данные.',
      data: 'Данные',
      goal: 'Цель',
      noGoal: 'не выбрана',
      records: (sessions, moods, chats) => `Записи: ${sessions} · check-in: ${moods} · чат: ${chats}`,
      rhythm: 'Ежедневный ритм',
      reminderOn: (time) => `Напоминание придёт в ${time}. Без личных деталей на экране.`,
      reminderOff: 'Можно включить мягкое напоминание, чтобы не терять контакт с собой.',
      on: 'Вкл',
      off: 'Выкл',
      close: 'Закрыть',
      exportData: 'Выгрузить мои данные',
      exportMarkdown: 'Выгрузить Markdown',
      clearData: 'Очистить дневник и чат',
      signOut: 'Выйти',
      deleteAccount: 'Удалить аккаунт и данные',
    },
    profile: {
      title: 'Профиль',
      subtitle: 'Настройки ритма, приватности и данных в одном месте.',
      signedIn: 'Вход выполнен',
      focus: 'Фокус',
      chooseFocus: 'Можно поменять без повторного онбординга.',
      stats: 'Личная статистика',
      sessions: 'разборы',
      moods: 'check-in',
      chats: 'чат',
      reminder: 'Ежедневное напоминание',
      reminderHintOn: (time) => `Включено на ${time}. Текст уведомления без личных деталей.`,
      reminderHintOff: 'Включи мягкий сигнал, если хочешь возвращаться к себе каждый день.',
      reminderTime: 'Время',
      language: 'Язык',
      privacy: 'Данные и приватность',
      privacyText: 'Экспорт, очистка дневника и удаление аккаунта используют защищённые запросы с текущей Supabase-сессией.',
      displayName: 'Имя',
      displayNamePlaceholder: 'Как к тебе обращаться',
      uploadAvatar: 'Загрузить аватарку',
      timezone: 'Часовой пояс',
      timezonePlaceholder: 'Например: Europe/Moscow',
      saveIdentity: 'Сохранить профиль',
      privacyLock: 'PIN-защита',
      privacyLockText: 'Локальный PIN скрывает дневник на этом устройстве. Это не заменяет вход в аккаунт.',
      privacyLockPlaceholder: '4-6 цифр',
      enablePrivacyLock: 'Включить PIN',
      disablePrivacyLock: 'Отключить PIN',
    },
    privacyLock: {
      title: 'Reflecta закрыта',
      text: 'Введи PIN, чтобы открыть личный дневник.',
      placeholder: 'PIN',
      unlock: 'Открыть',
      unlockBiometric: 'Открыть биометрией',
      wrongPin: 'PIN не подошёл.',
      invalidPin: 'PIN должен быть от 4 до 6 цифр.',
      enabled: 'PIN-защита включена.',
      disabled: 'PIN-защита отключена.',
    },
    alerts: {
      cancel: 'Отмена',
      delete: 'Удалить',
      clear: 'Очистить',
      deleteAccountTitle: 'Удалить аккаунт?',
      deleteAccountBody: 'Мы удалим профиль, дневник, check-in и чат. Вернуть это потом не получится.',
      clearDataTitle: 'Очистить личные записи?',
      clearDataBody: 'Дневник, check-in и чат исчезнут. Аккаунт и выбранная цель останутся.',
      deleteFailed: 'Не получилось удалить. Проверь соединение и попробуй ещё раз.',
      clearFailed: 'Не получилось очистить данные. Попробуй ещё раз.',
      saveFailed: 'Не получилось сохранить. Попробуй ещё раз.',
      exportFailed: 'Не получилось выгрузить данные. Попробуй ещё раз.',
      sessionNotReady: 'Сессия ещё не готова. Подожди пару секунд.',
      done: 'Готово',
      dataCleared: 'Дневник, check-in и чат очищены.',
      saved: 'Сохранено',
      journalSaved: 'Запись добавлена в дневник.',
      practiceSaved: 'Практика добавлена в дневник.',
      needSignIn: 'Нужен вход',
      signInToAnalyze: 'Войди, чтобы отправить личный текст на анализ.',
      saveNeedsSignIn: 'Войди, чтобы сохранить это в дневник.',
    },
    auth: {
      checking: 'Проверяю, ты ли это...',
      private: 'приватно',
      title: 'Выдохни. Дальше - по одному шагу.',
      text: 'Reflecta помогает заметить состояние, успокоить тело и сохранить то, что правда важно.',
      practiceValue: '90 сек',
      practiceLabel: 'практика',
      quietValue: 'без шума',
      quietLabel: 'личный дневник',
      formTitleSent: 'Письмо уже в пути',
      formTitleIdle: 'Сохраним твой ритм',
      formTextSent: 'Открой ссылку из письма. Если пришёл код, введи его здесь.',
      formTextIdle: 'Один вход - и дневник останется с тобой на любом устройстве.',
      codePlaceholder: 'код, если он есть',
      submitSent: 'Войти по коду',
      submitIdle: 'Войти',
      resendIn: (time) => `Ещё раз через ${time}`,
      resend: 'Отправить письмо ещё раз',
      footnote: 'Самоподдержка и рефлексия. Не экстренная помощь.',
    },
    chat: {
      title: 'Поговорить',
      subtitle: 'Можно написать как есть. Без диагнозов, давления и больших обещаний.',
      urgentTitle: 'Нужна срочная помощь?',
      urgentText: 'Если есть риск навредить себе или кому-то ещё, лучше подключить живого человека прямо сейчас.',
      anxiety: 'Тревога',
      sleep: 'Сон',
      practice: 'Практика',
      urgent: 'Срочно',
      anxietyPrompt: 'Меня накрывает тревога',
      sleepPrompt: 'Не могу уснуть',
      placeholder: 'Напиши одну фразу...',
      attach: 'Прикрепить',
      attachDocument: 'Документ',
      attachPhoto: 'Фото',
      attachmentFailed: 'Не получилось прикрепить файл.',
      welcome: 'Я рядом. Можно написать одной фразой, что сейчас тяжело. Это место для саморефлексии, не диагноз и не замена специалиста.',
      offline: 'Я рядом. Похоже, связь с сервером прервалась. Пока можно выбрать практику тревоги, сна или выгорания.',
    },
    common: {
      next: 'Дальше',
      continue: 'Продолжить',
      start: 'Начать',
      later: 'Позже',
      save: 'Сохранить',
      newAnalysis: 'Новый разбор',
      analysis: 'Разбор',
      practice: 'Практика',
      practiceCompleted: (title) => `Практика завершена: ${title}`,
      practiceReason: 'ты выбрал короткое действие вместо бесконечного анализа',
      journal: 'Дневник',
    },
    home: {
      kicker: 'Reflecta',
      title: 'Я рядом.',
      titleWithName: (name) => `${name}, я рядом.`,
      openPractice: 'Открыть практику',
      talkTitle: 'Поговорить',
      talkText: 'Напиши, что происходит. Я отвечу коротко и бережно.',
      safetyTitle: 'Если сейчас небезопасно',
      safetyText: 'Не оставайся один. Открой быстрые шаги к живой помощи.',
      moodTitle: 'Как ты сегодня?',
      moodHint: '10 секунд',
      morning: 'Утро',
      evening: 'Вечер',
      moodNotePlaceholder: 'Одна фраза: что влияет сейчас?',
      rhythmKicker: 'ежедневный ритм',
      rhythmSteps: (done) => `${done}/2 шага сегодня`,
      rhythmDone: 'На сегодня достаточно. Можно просто вернуться завтра.',
      rhythmMoodDone: 'Check-in есть. Осталась одна короткая практика.',
      rhythmStart: 'Начни с оценки состояния, потом выбери одну короткую практику.',
      repeat: 'Повторить',
      rhythmPanel: 'Твой ритм',
      rhythmClosed: 'Ритм дня закрыт',
      rhythmOneLeft: 'Остался один короткий шаг',
      rhythmOneTouch: 'Начни с одного касания',
      rhythmTextDone: 'Сегодня уже есть check-in и практика или разбор. Дальше лучше не давить.',
      rhythmTextMood: (scenario) => `Состояние отмечено. Сейчас лучше подойдёт: ${scenario}.`,
      rhythmTextEmpty: 'Оценка состояния даст приложению точку входа для сегодняшней практики.',
      time: 'Время',
      today: 'сегодня',
      touches: 'касания',
      focus: 'фокус',
      nextStep: 'Сделать следующий шаг',
      repeatPractice: 'Повторить практику',
      quickHelp: 'Быстрая помощь',
      quickHelpHint: 'три коротких пути',
      memoryTitle: 'Дневник эмоций',
      lastEntry: 'Последняя запись',
      lastEntryText: (date, scenario) => `${date}: ${scenario}. Можно вернуться к тому, что помогло.`,
      memoryText: 'Здесь появятся состояния, практики и маленькие выводы о твоей неделе.',
    },
    flow: {
      detailsTitle: 'Что ближе всего?',
      detailsHint: 'Можно выбрать несколько пунктов.',
      intensityTitle: 'Насколько это сильно?',
      noteTitle: 'Хочешь добавить одну фразу?',
      noteHint: 'Необязательно. Но если напишешь пару слов, ответ будет точнее.',
      notePlaceholder: 'Например: боюсь, что завтра снова не справлюсь',
      activityTitle: 'Что было рядом?',
      activityHint: 'Теги помогут потом увидеть повторяющиеся связи.',
      activityTags: {
        work: 'Работа',
        relationships: 'Отношения',
        health: 'Здоровье',
        sleep: 'Сон',
        food: 'Еда',
        caffeine: 'Кофеин',
        movement: 'Движение',
        alone: 'Одиночество',
        overload: 'Перегруз',
      },
      analyze: 'Разобрать состояние',
    },
    insights: {
      title: 'Итоги',
      subtitle: 'Мягкая картина по check-in, разборам и повторяющимся состояниям.',
      average: 'Среднее состояние',
      averageBasedOn: (count) => `На основе ${count} отметок.`,
      averageEmpty: 'Отметь состояние несколько раз, и здесь появится динамика.',
      analyses: 'Разборы',
      mostOften: 'Чаще всего',
      visible: 'Что заметно',
      visibleScenario: (scenario) => `${scenario} повторяется чаще других состояний. Держи короткую практику под рукой.`,
      visibleEmpty: 'Пока данных мало. Сделай пару check-in и сохрани первый разбор.',
      practiceFor: (scenario) => `Практика: ${scenario}`,
      startAnxiety: 'Начать с тревоги',
      thisWeek: 'Эта неделя',
      weekTouches: 'касания',
      weekMood: 'среднее',
      weekMoodDelta: (delta) => `${delta > 0 ? '+' : ''}${delta} к прошлой неделе`,
      weekMoodFlat: 'без заметного сдвига',
      weekMoodEmpty: 'Нужны check-in за две недели, чтобы увидеть динамику.',
      latestCheckIn: 'Последний check-in',
      latestCheckInText: (period, rating) => `${period}: ${rating}/5`,
      moodChart: 'Настроение по дням',
      moodChartEmpty: 'Отмечай настроение несколько дней, и здесь появится линия.',
      aiSummary: 'AI-вывод недели',
      aiSummaryButton: 'Собрать AI-вывод',
      aiSummaryHelped: 'Что помогало',
      aiSummaryNext: 'Что попробовать',
      aiSummaryEmpty: 'Собери короткий вывод по check-in, тегам и дневнику за последние дни.',
      sevenDays: '7 дней',
      thirtyDays: '30 дней',
      moodShort: 'настроение',
      notesShort: 'записи',
      trendEmpty: 'Пока мало данных',
      contexts: 'Частые контексты',
      highIntensityContexts: 'При высокой интенсивности',
      contextsEmpty: 'Добавь теги к нескольким разборам, и здесь появятся связи.',
    },
    journal: {
      title: 'Дневник эмоций',
      subtitle: 'Сохранённые разборы и то, что постепенно становится заметно.',
      emptyTitle: 'Пока пусто',
      emptyText: 'Сохрани первый разбор, и здесь появится история состояния.',
      practice: 'Практика',
      analysis: 'Разбор',
      all: 'Все',
      allStates: 'Все состояния',
      filteredEmptyTitle: 'Здесь пока нет таких записей',
      filteredEmptyText: 'Смени фильтр или сохрани новый разбор.',
      entriesCount: (count) => `${count} записей`,
      note: 'Заметка',
      open: 'Открыть',
      close: 'Свернуть',
      deleteEntry: 'Удалить запись',
      deleteEntryTitle: 'Удалить запись?',
      deleteEntryBody: 'Она исчезнет из дневника. Остальные данные останутся.',
      deleteEntryFailed: 'Не получилось удалить запись. Попробуй ещё раз.',
      calendar: 'Календарь',
      selectedDayEmpty: 'В этот день записей нет.',
      searchPlaceholder: 'Поиск по заметкам, шагам и состояниям',
    },
    onboarding: {
      kicker: 'настроим ритм',
      title: 'С чем ты чаще всего приходишь?',
      text: 'Выбери близкое состояние. Это можно поменять позже.',
      safety: 'Reflecta помогает выдохнуть и заметить себя. Если есть риск навредить себе или другим, нужна срочная живая помощь.',
      goals: {
        calm: { title: 'Тревожно', text: 'вернуть опору', label: 'снизить тревогу' },
        sleep: { title: 'Не спится', text: 'закрыть день', label: 'засыпать спокойнее' },
        burnout: { title: 'Нет сил', text: 'снять давление', label: 'вернуть ресурс' },
        journal: { title: 'Хочу понять себя', text: 'видеть паттерны', label: 'понять состояния' },
      },
    },
    practices: {
      title: 'Практики',
      subtitle: 'Короткие действия, когда не хочется объяснять всё заново.',
      complete: 'Завершить и сохранить',
    },
    result: {
      what: 'Что происходит',
      why: 'Почему так',
      steps: 'Маленькие шаги',
      now: 'Сейчас',
    },
    safety: {
      title: 'Сейчас нужна живая помощь',
      text: 'Если есть риск, что ты можешь причинить вред себе или кому-то ещё, не оставайся один.',
      step1: '1. Позови человека рядом или напиши близкому: “мне сейчас небезопасно, побудь со мной”.',
      step2: '2. Убери от себя всё, чем можно навредить.',
      step3: '3. Если опасность уже рядом, обратись в местные экстренные службы.',
      note: 'Reflecta может поддержать текстом, но не заменяет срочную помощь и очную поддержку.',
      understood: 'Я понял',
    },
    nav: { today: 'Дом', chat: 'Чат', practices: 'Практики', journal: 'Дневник', insights: 'Итоги', profile: 'Профиль' },
    authMessages: {
      missingEnv: 'Вход пока не настроен. Нужны параметры Supabase для фронта.',
      enterEmail: 'Введи email, чтобы отправить письмо для входа.',
      enterCode: 'Введи email и код из письма.',
      openLinkFailed: 'Не получилось открыть ссылку входа. Запроси письмо ещё раз.',
      codeFailed: 'Не получилось подтвердить код.',
      sendFailed: 'Не получилось отправить письмо. Проверь email и попробуй ещё раз.',
      tooMany: 'Писем было слишком много. Подожди немного и попробуй ещё раз.',
      invalidEmail: 'Проверь email: похоже, адрес введён с ошибкой.',
      sent: (time) => `Письмо отправлено. Открой ссылку или введи код, если он есть. Ещё раз можно через ${time}.`,
      sentNoRedirect: (time) => `Письмо отправлено. Если ссылка не вернёт в приложение, открой его вручную после входа. Ещё раз можно через ${time}.`,
      resendWait: (time) => `Повторно отправить письмо можно через ${time}.`,
      tooManyWait: (time) => `Слишком много запросов. Попробуй снова через ${time}.`,
      sendFailedWithMessage: (message) => `Не получилось отправить письмо: ${message}`,
      seconds: (seconds) => `${seconds} сек.`,
      minutes: (minutes, seconds) => `${minutes} мин. ${seconds.toString().padStart(2, '0')} сек.`,
    },
    notification: {
      body: 'Мягкий check-in: как ты сейчас?',
      channel: 'Reflecta Daily',
    },
  },
  en: {
    account: {
      title: 'Account',
      note: 'You can take your notes with you, set a reminder, or remove your data.',
      data: 'Data',
      goal: 'Focus',
      noGoal: 'not chosen yet',
      records: (sessions, moods, chats) => `Notes: ${sessions} · check-ins: ${moods} · chat: ${chats}`,
      rhythm: 'Daily rhythm',
      reminderOn: (time) => `A gentle reminder will arrive at ${time}. No personal details on the lock screen.`,
      reminderOff: 'Turn on a gentle reminder if you want a small daily touchpoint.',
      on: 'On',
      off: 'Off',
      close: 'Close',
      exportData: 'Export my data',
      exportMarkdown: 'Export Markdown',
      clearData: 'Clear journal and chat',
      signOut: 'Sign out',
      deleteAccount: 'Delete account and data',
    },
    profile: {
      title: 'Profile',
      subtitle: 'Rhythm, privacy, and data settings in one place.',
      signedIn: 'Signed in',
      focus: 'Focus',
      chooseFocus: 'You can change this without repeating onboarding.',
      stats: 'Personal stats',
      sessions: 'reflections',
      moods: 'check-ins',
      chats: 'chat',
      reminder: 'Daily reminder',
      reminderHintOn: (time) => `Enabled for ${time}. Notification text stays free of personal details.`,
      reminderHintOff: 'Turn on a gentle signal if you want a daily touchpoint.',
      reminderTime: 'Time',
      language: 'Language',
      privacy: 'Data and privacy',
      privacyText: 'Export, journal clearing, and account deletion use protected requests with the current Supabase session.',
      displayName: 'Name',
      displayNamePlaceholder: 'What should we call you?',
      uploadAvatar: 'Upload avatar',
      timezone: 'Timezone',
      timezonePlaceholder: 'For example: Europe/Moscow',
      saveIdentity: 'Save profile',
      privacyLock: 'PIN lock',
      privacyLockText: 'A local PIN hides your journal on this device. It does not replace account sign-in.',
      privacyLockPlaceholder: '4-6 digits',
      enablePrivacyLock: 'Enable PIN',
      disablePrivacyLock: 'Disable PIN',
    },
    privacyLock: {
      title: 'Reflecta is locked',
      text: 'Enter your PIN to open your private journal.',
      placeholder: 'PIN',
      unlock: 'Unlock',
      unlockBiometric: 'Use biometrics',
      wrongPin: 'That PIN did not work.',
      invalidPin: 'PIN must be 4 to 6 digits.',
      enabled: 'PIN lock is enabled.',
      disabled: 'PIN lock is disabled.',
    },
    alerts: {
      cancel: 'Cancel',
      delete: 'Delete',
      clear: 'Clear',
      deleteAccountTitle: 'Delete your account?',
      deleteAccountBody: 'Your profile, journal, check-ins and chat will be deleted. This cannot be undone.',
      clearDataTitle: 'Clear your personal notes?',
      clearDataBody: 'Your journal, check-ins and chat will disappear. Your account and focus will stay.',
      deleteFailed: 'Could not delete it. Check your connection and try again.',
      clearFailed: 'Could not clear the data. Try again in a moment.',
      saveFailed: 'Could not save it. Try again in a moment.',
      exportFailed: 'Could not export your data. Try again in a moment.',
      sessionNotReady: 'Your session is still waking up. Give it a second.',
      done: 'Done',
      dataCleared: 'Journal, check-ins and chat are cleared.',
      saved: 'Saved',
      journalSaved: 'Added to your journal.',
      practiceSaved: 'Practice added to your journal.',
      needSignIn: 'Sign in needed',
      signInToAnalyze: 'Sign in before sending personal text for analysis.',
      saveNeedsSignIn: 'Sign in to save this to your journal.',
    },
    auth: {
      checking: 'Checking your session...',
      private: 'private',
      title: 'Breathe out. One step at a time.',
      text: 'Reflecta helps you notice what is happening, settle your body, and keep what matters.',
      practiceValue: '90 sec',
      practiceLabel: 'practice',
      quietValue: 'quiet',
      quietLabel: 'personal journal',
      formTitleSent: 'The email is on its way',
      formTitleIdle: 'Keep your rhythm',
      formTextSent: 'Open the link in your email. If there is a code, enter it here.',
      formTextIdle: 'One sign-in keeps your journal with you on every device.',
      codePlaceholder: 'code, if you have one',
      submitSent: 'Sign in with code',
      submitIdle: 'Sign in',
      resendIn: (time) => `Again in ${time}`,
      resend: 'Send the email again',
      footnote: 'Self-support and reflection. Not emergency care.',
    },
    chat: {
      title: 'Talk',
      subtitle: 'Write it as it is. No labels, no pressure, no big promises.',
      urgentTitle: 'Need urgent help?',
      urgentText: 'If you might hurt yourself or someone else, involve a real person right now.',
      anxiety: 'Anxiety',
      sleep: 'Sleep',
      practice: 'Practice',
      urgent: 'Urgent',
      anxietyPrompt: 'Anxiety is washing over me',
      sleepPrompt: 'I cannot fall asleep',
      placeholder: 'Write one sentence...',
      attach: 'Attach',
      attachDocument: 'Document',
      attachPhoto: 'Photo',
      attachmentFailed: 'Could not attach the file.',
      welcome: 'I am here. You can write one sentence about what feels hard right now. This is a space for reflection, not a diagnosis or a replacement for professional help.',
      offline: 'I am here. It looks like the server connection dropped. For now, you can choose an anxiety, sleep, or low-energy practice.',
    },
    common: {
      next: 'Next',
      continue: 'Continue',
      start: 'Start',
      later: 'Later',
      save: 'Save',
      newAnalysis: 'New check-in',
      analysis: 'Check-in',
      practice: 'Practice',
      practiceCompleted: (title) => `Practice completed: ${title}`,
      practiceReason: 'you chose one small action instead of endless analysis',
      journal: 'Journal',
    },
    home: {
      kicker: 'Reflecta',
      title: 'I’m here.',
      titleWithName: (name) => `${name}, I’m here.`,
      openPractice: 'Open practice',
      talkTitle: 'Talk',
      talkText: 'Write what is happening. I will answer gently and keep it short.',
      safetyTitle: 'If you are not safe right now',
      safetyText: 'Do not stay alone. Open quick steps toward real help.',
      moodTitle: 'How are you today?',
      moodHint: '10 seconds',
      morning: 'Morning',
      evening: 'Evening',
      moodNotePlaceholder: 'One sentence: what is shaping this?',
      rhythmKicker: 'daily rhythm',
      rhythmSteps: (done) => `${done}/2 steps today`,
      rhythmDone: 'That is enough for today. You can simply come back tomorrow.',
      rhythmMoodDone: 'Your check-in is here. One short practice is left.',
      rhythmStart: 'Start with a state rating, then choose one short practice.',
      repeat: 'Repeat',
      rhythmPanel: 'Your rhythm',
      rhythmClosed: 'Today is complete',
      rhythmOneLeft: 'One small step left',
      rhythmOneTouch: 'Start with one touchpoint',
      rhythmTextDone: 'You already have a check-in and a practice or reflection today. No need to push.',
      rhythmTextMood: (scenario) => `Your state is saved. A good next step now: ${scenario}.`,
      rhythmTextEmpty: 'A quick state rating gives the app a starting point for today.',
      time: 'Time',
      today: 'today',
      touches: 'touches',
      focus: 'focus',
      nextStep: 'Take the next step',
      repeatPractice: 'Repeat practice',
      quickHelp: 'Quick support',
      quickHelpHint: 'three short paths',
      memoryTitle: 'Emotion journal',
      lastEntry: 'Last note',
      lastEntryText: (date, scenario) => `${date}: ${scenario}. You can come back to what helped.`,
      memoryText: 'Your states, practices and small weekly patterns will appear here.',
    },
    flow: {
      detailsTitle: 'What feels closest?',
      detailsHint: 'You can choose more than one.',
      intensityTitle: 'How strong is it?',
      noteTitle: 'Want to add one sentence?',
      noteHint: 'Optional. A few words can make the answer fit better.',
      notePlaceholder: 'For example: I am afraid tomorrow will be too much again',
      activityTitle: 'What was around it?',
      activityHint: 'Tags help surface repeated links later.',
      activityTags: {
        work: 'Work',
        relationships: 'Relationships',
        health: 'Health',
        sleep: 'Sleep',
        food: 'Food',
        caffeine: 'Caffeine',
        movement: 'Movement',
        alone: 'Alone',
        overload: 'Overload',
      },
      analyze: 'Understand this state',
    },
    insights: {
      title: 'Insights',
      subtitle: 'A gentle picture of check-ins, saved reflections and repeating states.',
      average: 'Average state',
      averageBasedOn: (count) => `Based on ${count} check-ins.`,
      averageEmpty: 'Check in a few times and your pattern will appear here.',
      analyses: 'Reflections',
      mostOften: 'Most often',
      visible: 'What stands out',
      visibleScenario: (scenario) => `${scenario} is showing up more than other states. Keep a short practice nearby.`,
      visibleEmpty: 'There is not much data yet. Do a few check-ins and save one reflection.',
      practiceFor: (scenario) => `Practice: ${scenario}`,
      startAnxiety: 'Start with anxiety',
      thisWeek: 'This week',
      weekTouches: 'touches',
      weekMood: 'average',
      weekMoodDelta: (delta) => `${delta > 0 ? '+' : ''}${delta} vs last week`,
      weekMoodFlat: 'no clear shift',
      weekMoodEmpty: 'Check in across two weeks to see movement.',
      latestCheckIn: 'Latest check-in',
      latestCheckInText: (period, rating) => `${period}: ${rating}/5`,
      moodChart: 'Mood by day',
      moodChartEmpty: 'Check in across a few days and a pattern will appear here.',
      aiSummary: 'AI weekly summary',
      aiSummaryButton: 'Generate AI summary',
      aiSummaryHelped: 'What helped',
      aiSummaryNext: 'What to try',
      aiSummaryEmpty: 'Generate a short summary from recent check-ins, tags and reflections.',
      sevenDays: '7 days',
      thirtyDays: '30 days',
      moodShort: 'mood',
      notesShort: 'entries',
      trendEmpty: 'Not enough data yet',
      contexts: 'Common contexts',
      highIntensityContexts: 'With high intensity',
      contextsEmpty: 'Add tags to a few reflections and links will appear here.',
    },
    journal: {
      title: 'Emotion journal',
      subtitle: 'Saved reflections and the patterns that slowly become visible.',
      emptyTitle: 'Nothing here yet',
      emptyText: 'Save your first reflection and this will become a history of what helped.',
      practice: 'Practice',
      analysis: 'Reflection',
      all: 'All',
      allStates: 'All states',
      filteredEmptyTitle: 'No entries match this yet',
      filteredEmptyText: 'Change the filter or save a new reflection.',
      entriesCount: (count) => `${count} entries`,
      note: 'Note',
      open: 'Open',
      close: 'Close',
      deleteEntry: 'Delete entry',
      deleteEntryTitle: 'Delete this entry?',
      deleteEntryBody: 'It will disappear from your journal. Everything else will stay.',
      deleteEntryFailed: 'Could not delete the entry. Try again.',
      calendar: 'Calendar',
      selectedDayEmpty: 'No entries on this day.',
      searchPlaceholder: 'Search notes, steps and states',
    },
    onboarding: {
      kicker: 'set your rhythm',
      title: 'What do you usually come here with?',
      text: 'Choose what feels closest. You can change it later.',
      safety: 'Reflecta can help you breathe and notice yourself. If there is risk of harm, you need urgent real-life support.',
      goals: {
        calm: { title: 'Anxious', text: 'find ground again', label: 'feel less anxious' },
        sleep: { title: 'Can’t sleep', text: 'close the day', label: 'fall asleep easier' },
        burnout: { title: 'No energy', text: 'lower the pressure', label: 'get energy back' },
        journal: { title: 'Understand myself', text: 'see patterns', label: 'understand my states' },
      },
    },
    practices: {
      title: 'Practices',
      subtitle: 'Short actions for moments when explaining everything again is too much.',
      complete: 'Finish and save',
    },
    result: {
      what: 'What is happening',
      why: 'Why it makes sense',
      steps: 'Small steps',
      now: 'Right now',
    },
    safety: {
      title: 'You need real help now',
      text: 'If you might hurt yourself or someone else, do not stay alone.',
      step1: '1. Ask someone nearby to stay with you, or message a trusted person: “I do not feel safe right now. Please stay with me.”',
      step2: '2. Move away from anything you could use to hurt yourself.',
      step3: '3. If danger is close, contact local emergency services.',
      note: 'Reflecta can support you with words, but it cannot replace urgent or in-person help.',
      understood: 'I understand',
    },
    nav: { today: 'Home', chat: 'Talk', practices: 'Practice', journal: 'Journal', insights: 'Insights', profile: 'Profile' },
    authMessages: {
      missingEnv: 'Sign-in is not configured yet. The frontend needs Supabase settings.',
      enterEmail: 'Enter your email so we can send the sign-in message.',
      enterCode: 'Enter your email and the code from the message.',
      openLinkFailed: 'Could not open the sign-in link. Ask for a new email.',
      codeFailed: 'Could not confirm the code.',
      sendFailed: 'Could not send the email. Check the address and try again.',
      tooMany: 'Too many emails were requested. Wait a little and try again.',
      invalidEmail: 'Check the email address. Something looks off.',
      sent: (time) => `Email sent. Open the link or enter the code if you got one. You can ask again in ${time}.`,
      sentNoRedirect: (time) => `Email sent. If the link does not bring you back, open the app after signing in. You can ask again in ${time}.`,
      resendWait: (time) => `You can send it again in ${time}.`,
      tooManyWait: (time) => `Too many requests. Try again in ${time}.`,
      sendFailedWithMessage: (message) => `Could not send the email: ${message}`,
      seconds: (seconds) => `${seconds}s`,
      minutes: (minutes, seconds) => `${minutes}m ${seconds.toString().padStart(2, '0')}s`,
    },
    notification: {
      body: 'A gentle check-in: how are you right now?',
      channel: 'Reflecta Daily',
    },
  },
  es: {
    account: {
      title: 'Cuenta',
      note: 'Puedes llevarte tus notas, ajustar el recordatorio o borrar tus datos.',
      data: 'Datos',
      goal: 'Enfoque',
      noGoal: 'aún no elegido',
      records: (sessions, moods, chats) => `Notas: ${sessions} · check-ins: ${moods} · chat: ${chats}`,
      rhythm: 'Ritmo diario',
      reminderOn: (time) => `Te llegará un recordatorio suave a las ${time}. Sin detalles personales en pantalla.`,
      reminderOff: 'Activa un recordatorio suave si quieres volver a ti una vez al día.',
      on: 'Sí',
      off: 'No',
      close: 'Cerrar',
      exportData: 'Exportar mis datos',
      exportMarkdown: 'Exportar Markdown',
      clearData: 'Borrar diario y chat',
      signOut: 'Salir',
      deleteAccount: 'Eliminar cuenta y datos',
    },
    profile: {
      title: 'Perfil',
      subtitle: 'Ritmo, privacidad y datos en un solo lugar.',
      signedIn: 'Sesión iniciada',
      focus: 'Enfoque',
      chooseFocus: 'Puedes cambiarlo sin repetir el onboarding.',
      stats: 'Estadísticas personales',
      sessions: 'reflexiones',
      moods: 'check-ins',
      chats: 'chat',
      reminder: 'Recordatorio diario',
      reminderHintOn: (time) => `Activado para las ${time}. El texto no muestra detalles personales.`,
      reminderHintOff: 'Activa una señal suave si quieres volver a ti cada día.',
      reminderTime: 'Hora',
      language: 'Idioma',
      privacy: 'Datos y privacidad',
      privacyText: 'Exportar, borrar el diario y eliminar la cuenta usan solicitudes protegidas con la sesión actual de Supabase.',
      displayName: 'Nombre',
      displayNamePlaceholder: 'Cómo quieres que te llame',
      uploadAvatar: 'Subir avatar',
      timezone: 'Zona horaria',
      timezonePlaceholder: 'Por ejemplo: Europe/Moscow',
      saveIdentity: 'Guardar perfil',
      privacyLock: 'Bloqueo con PIN',
      privacyLockText: 'Un PIN local oculta tu diario en este dispositivo. No reemplaza el acceso a la cuenta.',
      privacyLockPlaceholder: '4-6 dígitos',
      enablePrivacyLock: 'Activar PIN',
      disablePrivacyLock: 'Desactivar PIN',
    },
    privacyLock: {
      title: 'Reflecta está bloqueada',
      text: 'Escribe tu PIN para abrir tu diario privado.',
      placeholder: 'PIN',
      unlock: 'Abrir',
      unlockBiometric: 'Usar biometría',
      wrongPin: 'Ese PIN no funcionó.',
      invalidPin: 'El PIN debe tener entre 4 y 6 dígitos.',
      enabled: 'Bloqueo con PIN activado.',
      disabled: 'Bloqueo con PIN desactivado.',
    },
    alerts: {
      cancel: 'Cancelar',
      delete: 'Eliminar',
      clear: 'Borrar',
      deleteAccountTitle: '¿Eliminar tu cuenta?',
      deleteAccountBody: 'Se borrarán tu perfil, diario, check-ins y chat. No se podrá deshacer.',
      clearDataTitle: '¿Borrar tus notas personales?',
      clearDataBody: 'Desaparecerán el diario, los check-ins y el chat. Tu cuenta y enfoque se mantienen.',
      deleteFailed: 'No se pudo eliminar. Revisa la conexión e inténtalo otra vez.',
      clearFailed: 'No se pudieron borrar los datos. Inténtalo en un momento.',
      saveFailed: 'No se pudo guardar. Inténtalo en un momento.',
      exportFailed: 'No se pudieron exportar tus datos. Inténtalo en un momento.',
      sessionNotReady: 'La sesión aún se está preparando. Dale un segundo.',
      done: 'Listo',
      dataCleared: 'Diario, check-ins y chat borrados.',
      saved: 'Guardado',
      journalSaved: 'Añadido a tu diario.',
      practiceSaved: 'Práctica añadida a tu diario.',
      needSignIn: 'Necesitas entrar',
      signInToAnalyze: 'Entra antes de enviar texto personal para analizar.',
      saveNeedsSignIn: 'Entra para guardar esto en tu diario.',
    },
    auth: {
      checking: 'Comprobando tu sesión...',
      private: 'privado',
      title: 'Suelta el aire. Un paso a la vez.',
      text: 'Reflecta te ayuda a notar lo que pasa, calmar el cuerpo y guardar lo importante.',
      practiceValue: '90 seg',
      practiceLabel: 'práctica',
      quietValue: 'sin ruido',
      quietLabel: 'diario personal',
      formTitleSent: 'El correo ya va en camino',
      formTitleIdle: 'Guarda tu ritmo',
      formTextSent: 'Abre el enlace del correo. Si recibiste un código, escríbelo aquí.',
      formTextIdle: 'Un acceso y tu diario se queda contigo en cualquier dispositivo.',
      codePlaceholder: 'código, si lo tienes',
      submitSent: 'Entrar con código',
      submitIdle: 'Entrar',
      resendIn: (time) => `Otra vez en ${time}`,
      resend: 'Enviar el correo otra vez',
      footnote: 'Autocuidado y reflexión. No es ayuda de emergencia.',
    },
    chat: {
      title: 'Hablar',
      subtitle: 'Escribe tal como estás. Sin etiquetas, sin presión, sin promesas enormes.',
      urgentTitle: '¿Necesitas ayuda urgente?',
      urgentText: 'Si podrías hacerte daño o hacer daño a alguien, busca a una persona real ahora.',
      anxiety: 'Ansiedad',
      sleep: 'Sueño',
      practice: 'Práctica',
      urgent: 'Urgente',
      anxietyPrompt: 'La ansiedad me está sobrepasando',
      sleepPrompt: 'No puedo dormir',
      placeholder: 'Escribe una frase...',
      attach: 'Adjuntar',
      attachDocument: 'Documento',
      attachPhoto: 'Foto',
      attachmentFailed: 'No se pudo adjuntar el archivo.',
      welcome: 'Estoy aquí. Puedes escribir una frase sobre lo que pesa ahora. Este es un espacio de reflexión, no un diagnóstico ni un reemplazo de ayuda profesional.',
      offline: 'Estoy aquí. Parece que se cortó la conexión con el servidor. Por ahora puedes elegir una práctica para ansiedad, sueño o falta de energía.',
    },
    common: {
      next: 'Siguiente',
      continue: 'Continuar',
      start: 'Empezar',
      later: 'Después',
      save: 'Guardar',
      newAnalysis: 'Nuevo check-in',
      analysis: 'Check-in',
      practice: 'Práctica',
      practiceCompleted: (title) => `Práctica terminada: ${title}`,
      practiceReason: 'elegiste una acción pequeña en lugar de analizar sin fin',
      journal: 'Diario',
    },
    home: {
      kicker: 'Reflecta',
      title: 'Estoy aquí.',
      titleWithName: (name) => `${name}, estoy aquí.`,
      openPractice: 'Abrir práctica',
      talkTitle: 'Hablar',
      talkText: 'Escribe lo que pasa. Te responderé con cuidado y sin alargarlo.',
      safetyTitle: 'Si ahora no estás a salvo',
      safetyText: 'No te quedes solo. Abre pasos rápidos hacia ayuda real.',
      moodTitle: '¿Cómo estás hoy?',
      moodHint: '10 segundos',
      morning: 'Mañana',
      evening: 'Noche',
      moodNotePlaceholder: 'Una frase: ¿qué influye ahora?',
      rhythmKicker: 'ritmo diario',
      rhythmSteps: (done) => `${done}/2 pasos hoy`,
      rhythmDone: 'Por hoy es suficiente. Puedes volver mañana.',
      rhythmMoodDone: 'El check-in ya está. Queda una práctica corta.',
      rhythmStart: 'Empieza valorando tu estado y luego elige una práctica breve.',
      repeat: 'Repetir',
      rhythmPanel: 'Tu ritmo',
      rhythmClosed: 'Hoy está completo',
      rhythmOneLeft: 'Queda un paso pequeño',
      rhythmOneTouch: 'Empieza con un contacto',
      rhythmTextDone: 'Hoy ya tienes check-in y práctica o reflexión. No hace falta apretar más.',
      rhythmTextMood: (scenario) => `Tu estado quedó guardado. Ahora puede servirte: ${scenario}.`,
      rhythmTextEmpty: 'Una valoración rápida le da a la app un punto de partida para hoy.',
      time: 'Hora',
      today: 'hoy',
      touches: 'contactos',
      focus: 'foco',
      nextStep: 'Dar el siguiente paso',
      repeatPractice: 'Repetir práctica',
      quickHelp: 'Apoyo rápido',
      quickHelpHint: 'tres caminos breves',
      memoryTitle: 'Diario emocional',
      lastEntry: 'Última nota',
      lastEntryText: (date, scenario) => `${date}: ${scenario}. Puedes volver a lo que ayudó.`,
      memoryText: 'Aquí aparecerán tus estados, prácticas y pequeños patrones de la semana.',
    },
    flow: {
      detailsTitle: '¿Qué se parece más?',
      detailsHint: 'Puedes elegir más de una opción.',
      intensityTitle: '¿Qué tan fuerte es?',
      noteTitle: '¿Quieres añadir una frase?',
      noteHint: 'No es obligatorio. Unas palabras pueden hacer que la respuesta encaje mejor.',
      notePlaceholder: 'Por ejemplo: temo que mañana vuelva a no poder con todo',
      activityTitle: '¿Qué estaba cerca?',
      activityHint: 'Las etiquetas ayudan a ver conexiones repetidas después.',
      activityTags: {
        work: 'Trabajo',
        relationships: 'Relaciones',
        health: 'Salud',
        sleep: 'Sueño',
        food: 'Comida',
        caffeine: 'Cafeína',
        movement: 'Movimiento',
        alone: 'Soledad',
        overload: 'Sobrecarga',
      },
      analyze: 'Entender este estado',
    },
    insights: {
      title: 'Señales',
      subtitle: 'Una imagen suave de check-ins, reflexiones guardadas y estados que se repiten.',
      average: 'Estado medio',
      averageBasedOn: (count) => `Basado en ${count} check-ins.`,
      averageEmpty: 'Haz algunos check-ins y aquí aparecerá tu dinámica.',
      analyses: 'Reflexiones',
      mostOften: 'Más frecuente',
      visible: 'Lo que se nota',
      visibleScenario: (scenario) => `${scenario} aparece más que otros estados. Ten una práctica breve a mano.`,
      visibleEmpty: 'Todavía hay pocos datos. Haz un par de check-ins y guarda una reflexión.',
      practiceFor: (scenario) => `Práctica: ${scenario}`,
      startAnxiety: 'Empezar con ansiedad',
      thisWeek: 'Esta semana',
      weekTouches: 'contactos',
      weekMood: 'media',
      weekMoodDelta: (delta) => `${delta > 0 ? '+' : ''}${delta} vs semana anterior`,
      weekMoodFlat: 'sin cambio claro',
      weekMoodEmpty: 'Haz check-ins durante dos semanas para ver movimiento.',
      latestCheckIn: 'Último check-in',
      latestCheckInText: (period, rating) => `${period}: ${rating}/5`,
      moodChart: 'Ánimo por día',
      moodChartEmpty: 'Haz check-ins durante algunos días y aparecerá un patrón.',
      aiSummary: 'Resumen semanal con AI',
      aiSummaryButton: 'Crear resumen AI',
      aiSummaryHelped: 'Qué ayudó',
      aiSummaryNext: 'Qué probar',
      aiSummaryEmpty: 'Crea un resumen breve con check-ins, etiquetas y reflexiones recientes.',
      sevenDays: '7 días',
      thirtyDays: '30 días',
      moodShort: 'ánimo',
      notesShort: 'notas',
      trendEmpty: 'Todavía hay pocos datos',
      contexts: 'Contextos frecuentes',
      highIntensityContexts: 'Con intensidad alta',
      contextsEmpty: 'Añade etiquetas a algunas reflexiones y aparecerán conexiones.',
    },
    journal: {
      title: 'Diario emocional',
      subtitle: 'Reflexiones guardadas y patrones que poco a poco se vuelven visibles.',
      emptyTitle: 'Todavía está vacío',
      emptyText: 'Guarda tu primera reflexión y esto se convertirá en una historia de lo que te ayuda.',
      practice: 'Práctica',
      analysis: 'Reflexión',
      all: 'Todo',
      allStates: 'Todos los estados',
      filteredEmptyTitle: 'Aún no hay notas con este filtro',
      filteredEmptyText: 'Cambia el filtro o guarda una nueva reflexión.',
      entriesCount: (count) => `${count} notas`,
      note: 'Nota',
      open: 'Abrir',
      close: 'Cerrar',
      deleteEntry: 'Eliminar nota',
      deleteEntryTitle: '¿Eliminar esta nota?',
      deleteEntryBody: 'Desaparecerá del diario. El resto de datos se mantiene.',
      deleteEntryFailed: 'No se pudo eliminar la nota. Inténtalo otra vez.',
      calendar: 'Calendario',
      selectedDayEmpty: 'No hay notas en este día.',
      searchPlaceholder: 'Buscar notas, pasos y estados',
    },
    onboarding: {
      kicker: 'ajustemos tu ritmo',
      title: '¿Con qué sueles llegar aquí?',
      text: 'Elige lo más cercano. Puedes cambiarlo después.',
      safety: 'Reflecta puede ayudarte a respirar y notarte. Si hay riesgo de daño, necesitas apoyo real urgente.',
      goals: {
        calm: { title: 'Ansiedad', text: 'volver a tener suelo', label: 'bajar la ansiedad' },
        sleep: { title: 'No duermo', text: 'cerrar el día', label: 'dormir con más calma' },
        burnout: { title: 'Sin energía', text: 'bajar la presión', label: 'recuperar energía' },
        journal: { title: 'Quiero entenderme', text: 'ver patrones', label: 'entender mis estados' },
      },
    },
    practices: {
      title: 'Prácticas',
      subtitle: 'Acciones cortas para cuando explicar todo otra vez pesa demasiado.',
      complete: 'Terminar y guardar',
    },
    result: {
      what: 'Qué está pasando',
      why: 'Por qué tiene sentido',
      steps: 'Pasos pequeños',
      now: 'Ahora',
    },
    safety: {
      title: 'Ahora necesitas ayuda real',
      text: 'Si podrías hacerte daño o hacer daño a alguien, no te quedes solo.',
      step1: '1. Pide a alguien cercano que se quede contigo o escribe a una persona de confianza: “ahora no me siento seguro, quédate conmigo”.',
      step2: '2. Aléjate de cualquier cosa con la que podrías hacerte daño.',
      step3: '3. Si el peligro está cerca, llama a los servicios de emergencia de tu zona.',
      note: 'Reflecta puede acompañarte con palabras, pero no sustituye ayuda urgente ni presencial.',
      understood: 'Entiendo',
    },
    nav: { today: 'Inicio', chat: 'Hablar', practices: 'Prácticas', journal: 'Diario', insights: 'Señales', profile: 'Perfil' },
    authMessages: {
      missingEnv: 'El acceso aún no está configurado. Faltan los datos de Supabase en el frontend.',
      enterEmail: 'Escribe tu email para enviarte el acceso.',
      enterCode: 'Escribe tu email y el código del correo.',
      openLinkFailed: 'No se pudo abrir el enlace de acceso. Pide otro correo.',
      codeFailed: 'No se pudo confirmar el código.',
      sendFailed: 'No se pudo enviar el correo. Revisa el email e inténtalo otra vez.',
      tooMany: 'Se pidieron demasiados correos. Espera un poco e inténtalo de nuevo.',
      invalidEmail: 'Revisa el email. Parece que hay algo raro.',
      sent: (time) => `Correo enviado. Abre el enlace o escribe el código si llegó. Puedes pedir otro en ${time}.`,
      sentNoRedirect: (time) => `Correo enviado. Si el enlace no vuelve a la app, ábrela después de entrar. Puedes pedir otro en ${time}.`,
      resendWait: (time) => `Puedes enviarlo otra vez en ${time}.`,
      tooManyWait: (time) => `Demasiadas solicitudes. Inténtalo de nuevo en ${time}.`,
      sendFailedWithMessage: (message) => `No se pudo enviar el correo: ${message}`,
      seconds: (seconds) => `${seconds}s`,
      minutes: (minutes, seconds) => `${minutes}m ${seconds.toString().padStart(2, '0')}s`,
    },
    notification: {
      body: 'Un check-in suave: ¿cómo estás ahora?',
      channel: 'Reflecta Diario',
    },
  },
};

export function getScenarios(language: Language): Scenario[] {
  return (Object.keys(scenarioMeta) as ScenarioId[]).map((id) => ({
    ...scenarioMeta[id],
    ...scenarioCopy[language][id],
  }));
}

export function getScenario(language: Language, id?: ScenarioId | null): Scenario {
  return getScenarios(language).find((scenario) => scenario.id === id) ?? getScenarios(language)[0];
}
