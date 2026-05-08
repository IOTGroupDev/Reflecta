import { copy, getScenario as getLocalizedScenario, getScenarios, practicePlansByLanguage } from './i18n';
import type { DailyPlan, JournalEntry, JournalSummary, Language, ScenarioId, WeeklyReflection } from './types';

export function getScenario(id?: ScenarioId | null, language: Language = 'ru') {
  return getLocalizedScenario(language, id);
}

export function getDailyPlan(
  summary: JournalSummary | null,
  todayMood: number | null,
  lastEntry?: JournalEntry,
  starterScenarioId?: ScenarioId,
  starterGoalLabel?: string,
  language: Language = 'ru',
): DailyPlan {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const practicePlans = practicePlansByLanguage[language];
  const topScenario = summary?.topScenario?.id;
  const latestScenario = summary?.latestSession?.scenario ?? lastEntry?.scenario.id;
  const mood = todayMood ?? summary?.latestMood?.rating ?? null;
  const scenario = getScenario(mood !== null && mood <= 2 ? 'burnout' : topScenario ?? latestScenario, language);

  if (mood !== null && mood <= 2) {
    return {
      scenario,
      title: language === 'ru' ? 'Сегодня бережный минимум' : language === 'en' ? 'A gentle minimum today' : 'Un mínimo amable para hoy',
      body: language === 'ru'
        ? 'Состояние низкое, поэтому цель не разогнаться, а снизить давление.'
        : language === 'en'
          ? 'Your state is low, so the point is not to push. It is to lower the pressure.'
          : 'Tu estado está bajo; la idea no es empujar, sino bajar la presión.',
      reason: language === 'ru' ? 'по последнему check-in' : language === 'en' ? 'from your latest check-in' : 'por tu último check-in',
      action: language === 'ru' ? '3 минуты без давления' : language === 'en' ? '3 minutes, no pressure' : '3 minutos, sin presión',
    };
  }

  if (summary?.topScenario) {
    return {
      scenario,
      title: language === 'ru' ? `Сегодня: ${scenario.title}` : language === 'en' ? `Today: ${scenario.title}` : `Hoy: ${scenario.title}`,
      body: language === 'ru'
        ? 'Это состояние повторялось чаще других. Лучше держать короткую практику под рукой заранее.'
        : language === 'en'
          ? 'This state has shown up more than the others. Keep a short practice close.'
          : 'Este estado aparece más que los otros. Ten una práctica breve cerca.',
      reason: language === 'ru'
        ? `${summary.topScenario.count} повторения в дневнике`
        : language === 'en'
          ? `${summary.topScenario.count} journal touches`
          : `${summary.topScenario.count} contactos en el diario`,
      action: practicePlans[scenario.id].duration,
    };
  }

  if (lastEntry) {
    return {
      scenario: lastEntry.scenario,
      title: language === 'ru' ? 'Вернуться к тому, что уже помогло' : language === 'en' ? 'Return to what already helped' : 'Volver a lo que ya ayudó',
      body: language === 'ru'
        ? `${lastEntry.scenario.title} уже был в дневнике. Можно повторить короткую практику без нового разбора.`
        : language === 'en'
          ? `${lastEntry.scenario.title} is already in your journal. You can repeat the practice without a new reflection.`
          : `${lastEntry.scenario.title} ya está en tu diario. Puedes repetir la práctica sin otra reflexión.`,
      reason: language === 'ru' ? 'по последней записи' : language === 'en' ? 'from your last note' : 'por tu última nota',
      action: practicePlans[lastEntry.scenario.id].duration,
    };
  }

  if (starterScenarioId) {
    const starterScenario = getScenario(starterScenarioId);

    return {
      scenario: starterScenario,
      title: language === 'ru'
        ? `Начать с цели: ${starterGoalLabel ?? starterScenario.title}`
        : language === 'en'
          ? `Start with: ${starterGoalLabel ?? starterScenario.title}`
          : `Empezar con: ${starterGoalLabel ?? starterScenario.title}`,
      body: language === 'ru'
        ? 'Ты выбрал это направление на первом экране. Достаточно одной короткой практики, чтобы Reflecta начала подстраиваться.'
        : language === 'en'
          ? 'You chose this direction at the start. One short practice is enough for Reflecta to begin adapting.'
          : 'Elegiste esta dirección al inicio. Una práctica breve basta para que Reflecta empiece a adaptarse.',
      reason: language === 'ru' ? 'по выбранной цели' : language === 'en' ? 'from your chosen focus' : 'por tu enfoque elegido',
      action: practicePlans[starterScenario.id].duration,
    };
  }

  return {
    scenario: scenarios[0],
    title: language === 'ru' ? 'Начать с мягкой опоры' : language === 'en' ? 'Start with gentle ground' : 'Empezar con un poco de suelo',
    body: language === 'ru'
      ? 'Сделай первый короткий check-in и практику тревоги. Этого достаточно, чтобы приложение начало подстраиваться.'
      : language === 'en'
        ? 'Do one quick check-in and a short anxiety practice. That is enough for the app to begin adapting.'
        : 'Haz un check-in rápido y una práctica breve para ansiedad. Con eso la app empieza a adaptarse.',
    reason: language === 'ru' ? 'первые данные' : language === 'en' ? 'first signals' : 'primeras señales',
    action: practicePlans.anxiety.duration,
  };
}

export function getWeeklyReflection(summary: JournalSummary | null, language: Language = 'ru'): WeeklyReflection {
  const scenarioId = summary?.week?.topScenario?.id ?? summary?.topScenario?.id;
  const scenario = scenarioId ? getScenario(scenarioId, language) : null;
  const averageMood = summary?.week?.averageMood ?? summary?.averageMood;
  const moodCount = summary?.week?.moodCount ?? summary?.moodCount;
  const sessionCount = summary?.week?.sessionCount ?? summary?.sessionCount;
  const hasWeeklyData = Boolean(moodCount || sessionCount);

  return {
    title: hasWeeklyData
      ? language === 'ru' ? 'Неделя начинает проявляться' : language === 'en' ? 'Your week is starting to show' : 'Tu semana empieza a mostrarse'
      : language === 'ru' ? 'Пока данных мало' : language === 'en' ? 'Not much to read yet' : 'Todavía hay pocos datos',
    points: [
      averageMood
        ? language === 'ru' ? `Среднее состояние: ${averageMood}. Это не оценка тебя, а ориентир нагрузки.` : language === 'en' ? `Average state: ${averageMood}. This is not a grade, just a signal of load.` : `Estado medio: ${averageMood}. No es una nota, solo una señal de carga.`
        : language === 'ru' ? 'Отметь состояние 2-3 раза, чтобы увидеть первую динамику.' : language === 'en' ? 'Check in 2-3 times to see the first pattern.' : 'Haz 2-3 check-ins para ver el primer patrón.',
      scenario
        ? language === 'ru' ? `${scenario.title} появляется чаще других состояний. Это хороший кандидат для короткой регулярной практики.` : language === 'en' ? `${scenario.title} appears more than other states. It is a good candidate for a small regular practice.` : `${scenario.title} aparece más que otros estados. Puede ser una buena práctica breve y regular.`
        : language === 'ru' ? 'Сохрани хотя бы один разбор, чтобы увидеть повторяющийся сценарий.' : language === 'en' ? 'Save at least one reflection to see what repeats.' : 'Guarda al menos una reflexión para ver qué se repite.',
      sessionCount
        ? language === 'ru' ? `На этой неделе в дневнике ${sessionCount} записей. Можно смотреть не на идеальную серию, а на касания в течение недели.` : language === 'en' ? `There are ${sessionCount} journal notes this week. The point is not a perfect streak, but returning during the week.` : `Hay ${sessionCount} notas esta semana. No se trata de una racha perfecta, sino de volver durante la semana.`
        : language === 'ru' ? 'Первое касание недели может быть маленьким: check-in или практика на 90 секунд.' : language === 'en' ? 'The first touchpoint can be tiny: a check-in or a 90-second practice.' : 'El primer contacto puede ser pequeño: un check-in o una práctica de 90 segundos.',
    ],
    next: scenario
      ? language === 'ru' ? `На этой неделе держи под рукой: ${practicePlansByLanguage[language][scenario.id].title}.` : language === 'en' ? `This week, keep nearby: ${practicePlansByLanguage[language][scenario.id].title}.` : `Esta semana, ten cerca: ${practicePlansByLanguage[language][scenario.id].title}.`
      : language === 'ru' ? 'Следующий шаг: один check-in и одна короткая практика.' : language === 'en' ? 'Next step: one check-in and one short practice.' : 'Siguiente paso: un check-in y una práctica breve.',
  };
}
