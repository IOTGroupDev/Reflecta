import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { InsightMetricCard } from '../components/insights/InsightMetricCard';
import { PrimaryButton } from '../components/ui/ActionButton';
import { PageHeader } from '../components/ui/PageHeader';
import { getWeeklyReflection } from '../plans';
import { scenarios } from '../data';
import type { JournalSummary, Scenario } from '../types';

export function InsightsScreen({
  onPractice,
  summary,
}: {
  onPractice: (scenario: Scenario) => void;
  summary: JournalSummary | null;
}) {
  const scenario = summary?.topScenario
    ? scenarios.find((item) => item.id === summary.topScenario?.id)
    : null;
  const recommendedScenario = scenario ?? scenarios[0];
  const reflection = getWeeklyReflection(summary);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Итоги"
        subtitle="Мягкая картина по check-in, разборам и повторяющимся состояниям."
      />

      <View style={styles.insightHero}>
        <Text style={styles.insightNumber}>
          {summary?.averageMood ? summary.averageMood : '—'}
        </Text>
        <Text style={styles.panelTitle}>Среднее состояние</Text>
        <Text style={styles.panelText}>
          {summary?.moodCount
            ? `На основе ${summary.moodCount} отметок.`
            : 'Отметь состояние несколько раз, и здесь появится динамика.'}
        </Text>
      </View>

      <View style={styles.insightGrid}>
        <InsightMetricCard label="Разборы" value={summary?.sessionCount ?? 0} />
        <InsightMetricCard label="Чаще всего" value={scenario?.title ?? '—'} />
      </View>

      <View style={styles.weeklyPanel}>
        <Text style={styles.panelTitle}>{reflection.title}</Text>
        {reflection.points.map((point) => (
          <Text key={point} style={styles.weeklyPoint}>{point}</Text>
        ))}
        <Text style={styles.weeklyNext}>{reflection.next}</Text>
      </View>

      <View style={styles.memoryPanel}>
        <Text style={styles.panelTitle}>Что заметно</Text>
        <Text style={styles.panelText}>
          {scenario
            ? `${scenario.title} повторяется чаще других состояний. Можно держать под рукой короткую практику на этот случай.`
            : 'Пока данных мало. Сделай пару check-in и сохрани первый разбор.'}
        </Text>
        <PrimaryButton
          label={scenario ? `Практика: ${scenario.title}` : 'Начать с тревоги'}
          onPress={() => onPractice(recommendedScenario)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  insightHero: {
    backgroundColor: 'rgba(247, 251, 255, 0.82)',
    borderRadius: 28,
    padding: 22,
  },
  insightNumber: {
    color: '#1976ee',
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 4,
  },
  panelTitle: {
    color: '#17233a',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  panelText: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  weeklyPanel: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 26,
    marginTop: 14,
    padding: 20,
  },
  weeklyPoint: {
    color: '#52627a',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  weeklyNext: {
    color: '#1976ee',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 21,
    marginTop: 14,
  },
  memoryPanel: {
    backgroundColor: 'rgba(247, 251, 255, 0.68)',
    borderRadius: 26,
    marginTop: 24,
    padding: 20,
  },
});
