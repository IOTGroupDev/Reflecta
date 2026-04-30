import { practicePlans, scenarios } from './data';
import type { DailyPlan, JournalEntry, JournalSummary, ScenarioId, WeeklyReflection } from './types';

export function getScenario(id?: ScenarioId | null) {
  return scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
}

export function getDailyPlan(
  summary: JournalSummary | null,
  todayMood: number | null,
  lastEntry?: JournalEntry,
): DailyPlan {
  const topScenario = summary?.topScenario?.id;
  const latestScenario = summary?.latestSession?.scenario ?? lastEntry?.scenario.id;
  const mood = todayMood ?? summary?.latestMood?.rating ?? null;
  const scenario = getScenario(mood !== null && mood <= 2 ? 'burnout' : topScenario ?? latestScenario);

  if (mood !== null && mood <= 2) {
    return {
      scenario,
      title: 'Сегодня бережный минимум',
      body: 'Состояние низкое, поэтому цель не разогнаться, а снизить давление.',
      reason: 'по последнему check-in',
      action: '3 минуты без давления',
    };
  }

  if (summary?.topScenario) {
    return {
      scenario,
      title: `Сегодня: ${scenario.title}`,
      body: `Это состояние повторялось чаще других. Лучше держать короткую практику под рукой заранее.`,
      reason: `${summary.topScenario.count} повторения в дневнике`,
      action: practicePlans[scenario.id].duration,
    };
  }

  if (lastEntry) {
    return {
      scenario: lastEntry.scenario,
      title: 'Вернуться к тому, что уже помогло',
      body: `${lastEntry.scenario.title} уже был в дневнике. Можно повторить короткую практику без нового разбора.`,
      reason: 'по последней записи',
      action: practicePlans[lastEntry.scenario.id].duration,
    };
  }

  return {
    scenario: scenarios[0],
    title: 'Начать с мягкой опоры',
    body: 'Сделай первый короткий check-in и практику тревоги. Этого достаточно, чтобы приложение начало подстраиваться.',
    reason: 'первые данные',
    action: practicePlans.anxiety.duration,
  };
}

export function getWeeklyReflection(summary: JournalSummary | null): WeeklyReflection {
  const scenario = summary?.topScenario ? getScenario(summary.topScenario.id) : null;
  const averageMood = summary?.averageMood;

  return {
    title: summary?.moodCount || summary?.sessionCount ? 'Неделя начинает проявляться' : 'Пока данных мало',
    points: [
      averageMood
        ? `Среднее состояние: ${averageMood}. Это не оценка тебя, а ориентир нагрузки.`
        : 'Отметь состояние 2-3 раза, чтобы увидеть первую динамику.',
      scenario
        ? `${scenario.title} появляется чаще других состояний. Это хороший кандидат для короткой регулярной практики.`
        : 'Сохрани хотя бы один разбор, чтобы увидеть повторяющийся сценарий.',
      summary?.sessionCount
        ? `В дневнике уже ${summary.sessionCount} записей. Можно смотреть не на идеальную серию, а на касания в течение недели.`
        : 'Первое касание недели может быть маленьким: check-in или практика на 90 секунд.',
    ],
    next: scenario
      ? `На этой неделе держи под рукой: ${practicePlans[scenario.id].title}.`
      : 'Следующий шаг: один check-in и одна короткая практика.',
  };
}
