import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { InsightMetricCard } from '../components/insights/InsightMetricCard';
import { PrimaryButton } from '../components/ui/ActionButton';
import { PageHeader } from '../components/ui/PageHeader';
import { getWeeklyReflection } from '../plans';
import { copy, getScenarios } from '../i18n';
import type { ActivityTag, JournalMoodPoint, JournalSummary, Language, Scenario, WeeklyAiSummary } from '../types';

export function InsightsScreen({
  language,
  onBack,
  onPractice,
  onWeeklyAiSummary,
  summary,
  weeklyAiSummary,
  weeklyAiSummaryLoading,
}: {
  language: Language;
  onBack: () => void;
  onPractice: (scenario: Scenario) => void;
  onWeeklyAiSummary: () => Promise<void>;
  summary: JournalSummary | null;
  weeklyAiSummary: WeeklyAiSummary | null;
  weeklyAiSummaryLoading: boolean;
}) {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const scenario = summary?.topScenario
    ? scenarios.find((item) => item.id === summary.topScenario?.id)
    : null;
  const recommendedScenario = scenario ?? scenarios[0];
  const reflection = getWeeklyReflection(summary, language);
  const sevenDayTopScenario = summary?.windows?.sevenDays.topScenario
    ? scenarios.find((item) => item.id === summary.windows?.sevenDays.topScenario?.id)
    : null;
  const thirtyDayTopScenario = summary?.windows?.thirtyDays.topScenario
    ? scenarios.find((item) => item.id === summary.windows?.thirtyDays.topScenario?.id)
    : null;
  const weekTouches = (summary?.week?.moodCount ?? 0) + (summary?.week?.sessionCount ?? 0);
  const weekMood = summary?.week?.averageMood;
  const moodDelta = summary?.week?.moodDelta;
  const moodDeltaText =
    moodDelta === null || moodDelta === undefined
      ? t.insights.weekMoodEmpty
      : moodDelta === 0
        ? t.insights.weekMoodFlat
        : t.insights.weekMoodDelta(moodDelta);
  const latestMoodPeriod = summary?.latestMood?.period
    ? summary.latestMood.period === 'morning'
      ? t.home.morning
      : t.home.evening
    : null;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        onBack={onBack}
        title={t.insights.title}
        subtitle={t.insights.subtitle}
      />

      <View style={styles.insightHero}>
        <Text style={styles.insightNumber}>
          {summary?.averageMood ? summary.averageMood : '—'}
        </Text>
        <Text style={styles.panelTitle}>{t.insights.average}</Text>
        <Text style={styles.panelText}>
          {summary?.moodCount
            ? t.insights.averageBasedOn(summary.moodCount)
            : t.insights.averageEmpty}
        </Text>
      </View>

      <View style={styles.insightGrid}>
        <InsightMetricCard label={t.insights.analyses} value={summary?.sessionCount ?? 0} />
        <InsightMetricCard label={t.insights.mostOften} value={scenario?.title ?? '—'} />
      </View>

      {summary?.latestMood ? (
        <View style={styles.latestMoodPanel}>
          <Text style={styles.latestMoodTitle}>{t.insights.latestCheckIn}</Text>
          <Text style={styles.latestMoodValue}>
            {t.insights.latestCheckInText(latestMoodPeriod ?? t.home.moodTitle, summary.latestMood.rating)}
          </Text>
          {summary.latestMood.note ? (
            <Text style={styles.latestMoodNote}>{summary.latestMood.note}</Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.weekStatsPanel}>
        <View>
          <Text style={styles.weekKicker}>{t.insights.thisWeek}</Text>
          <Text style={styles.weekStatNumber}>{weekTouches}</Text>
          <Text style={styles.weekStatLabel}>{t.insights.weekTouches}</Text>
        </View>
        <View style={styles.weekDivider} />
        <View style={styles.weekMoodBlock}>
          <Text style={styles.weekMoodNumber}>{weekMood ?? '—'}</Text>
          <Text style={styles.weekStatLabel}>{t.insights.weekMood}</Text>
          <Text style={styles.weekDelta}>{moodDeltaText}</Text>
        </View>
      </View>

      <View style={styles.trendGrid}>
        <TrendCard
          label={t.insights.sevenDays}
          moodLabel={t.insights.moodShort}
          notesLabel={t.insights.notesShort}
          emptyLabel={t.insights.trendEmpty}
          averageMood={summary?.windows?.sevenDays.averageMood ?? null}
          entriesCount={
            (summary?.windows?.sevenDays.moodCount ?? 0) +
            (summary?.windows?.sevenDays.sessionCount ?? 0)
          }
          scenarioTitle={sevenDayTopScenario?.title ?? null}
        />
        <TrendCard
          label={t.insights.thirtyDays}
          moodLabel={t.insights.moodShort}
          notesLabel={t.insights.notesShort}
          emptyLabel={t.insights.trendEmpty}
          averageMood={summary?.windows?.thirtyDays.averageMood ?? null}
          entriesCount={
            (summary?.windows?.thirtyDays.moodCount ?? 0) +
            (summary?.windows?.thirtyDays.sessionCount ?? 0)
          }
          scenarioTitle={thirtyDayTopScenario?.title ?? null}
        />
      </View>

      <MoodChart
        emptyLabel={t.insights.moodChartEmpty}
        label={t.insights.moodChart}
        points={summary?.moodSeries ?? []}
      />

      <View style={styles.aiPanel}>
        <Text style={[styles.panelTitle, styles.aiPanelTitle]}>{t.insights.aiSummary}</Text>
        {weeklyAiSummary ? (
          <>
            <Text style={styles.aiTitle}>{weeklyAiSummary.summary.title}</Text>
            <Text style={styles.aiText}>{weeklyAiSummary.summary.pattern}</Text>
            <Text style={styles.aiSectionTitle}>{t.insights.aiSummaryHelped}</Text>
            {weeklyAiSummary.summary.helped.map((item) => (
              <Text key={item} style={styles.aiListItem}>{item}</Text>
            ))}
            <Text style={styles.aiSectionTitle}>{t.insights.aiSummaryNext}</Text>
            {weeklyAiSummary.summary.next.map((item) => (
              <Text key={item} style={styles.aiListItem}>{item}</Text>
            ))}
            <Text style={styles.aiCaution}>{weeklyAiSummary.summary.caution}</Text>
          </>
        ) : (
          <Text style={styles.aiText}>{t.insights.aiSummaryEmpty}</Text>
        )}
        <PrimaryButton
          label={t.insights.aiSummaryButton}
          loading={weeklyAiSummaryLoading}
          onPress={onWeeklyAiSummary}
        />
      </View>

      <View style={styles.contextPanel}>
        <Text style={styles.panelTitle}>{t.insights.contexts}</Text>
        <TagPatternRow
          emptyLabel={t.insights.contextsEmpty}
          labels={t.flow.activityTags}
          tags={summary?.tagPatterns?.topTags ?? []}
        />
        <Text style={styles.contextSubtitle}>{t.insights.highIntensityContexts}</Text>
        <TagPatternRow
          emptyLabel={t.insights.contextsEmpty}
          labels={t.flow.activityTags}
          tags={summary?.tagPatterns?.highIntensityTags ?? []}
        />
      </View>

      <View style={styles.weeklyPanel}>
        <Text style={styles.panelTitle}>{reflection.title}</Text>
        {reflection.points.map((point) => (
          <Text key={point} style={styles.weeklyPoint}>{point}</Text>
        ))}
        <Text style={styles.weeklyNext}>{reflection.next}</Text>
      </View>

      <View style={styles.memoryPanel}>
        <Text style={styles.panelTitle}>{t.insights.visible}</Text>
        <Text style={styles.panelText}>
          {scenario
            ? t.insights.visibleScenario(scenario.title)
            : t.insights.visibleEmpty}
        </Text>
        <PrimaryButton
          label={scenario ? t.insights.practiceFor(scenario.title) : t.insights.startAnxiety}
          onPress={() => onPractice(recommendedScenario)}
        />
      </View>
    </ScrollView>
  );
}

function MoodChart({
  emptyLabel,
  label,
  points,
}: {
  emptyLabel: string;
  label: string;
  points: JournalMoodPoint[];
}) {
  const hasData = points.some((point) => point.averageMood !== null);

  return (
    <View style={styles.chartPanel}>
      <Text style={styles.panelTitle}>{label}</Text>
      {hasData ? (
        <View style={styles.chartBars}>
          {points.map((point) => {
            const height = point.averageMood ? Math.max(12, point.averageMood * 24) : 8;

            return (
              <View key={point.date} style={styles.chartColumn}>
                <View style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      point.averageMood === null && styles.chartBarEmpty,
                      { height },
                    ]}
                  />
                </View>
                <Text style={styles.chartLabel}>{formatChartDay(point.date)}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.panelText}>{emptyLabel}</Text>
      )}
    </View>
  );
}

function TagPatternRow({
  emptyLabel,
  labels,
  tags,
}: {
  emptyLabel: string;
  labels: Record<ActivityTag, string>;
  tags: Array<{ id: ActivityTag; count: number }>;
}) {
  if (tags.length === 0) {
    return <Text style={styles.contextEmpty}>{emptyLabel}</Text>;
  }

  return (
    <View style={styles.contextTags}>
      {tags.map((tag) => (
        <View key={tag.id} style={styles.contextTag}>
          <Text style={styles.contextTagText}>{labels[tag.id]}</Text>
          <Text style={styles.contextTagCount}>{tag.count}</Text>
        </View>
      ))}
    </View>
  );
}

function TrendCard({
  averageMood,
  emptyLabel,
  entriesCount,
  label,
  moodLabel,
  notesLabel,
  scenarioTitle,
}: {
  averageMood: number | null;
  emptyLabel: string;
  entriesCount: number;
  label: string;
  moodLabel: string;
  notesLabel: string;
  scenarioTitle: string | null;
}) {
  return (
    <View style={styles.trendCard}>
      <Text style={styles.trendLabel}>{label}</Text>
      <View style={styles.trendRow}>
        <Text style={styles.trendNumber}>{averageMood ?? '—'}</Text>
        <Text style={styles.trendCaption}>{moodLabel}</Text>
      </View>
      <Text style={styles.trendMeta}>
        {entriesCount > 0 ? `${entriesCount} ${notesLabel}` : emptyLabel}
      </Text>
      {scenarioTitle ? <Text style={styles.trendScenario}>{scenarioTitle}</Text> : null}
    </View>
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
  weekStatsPanel: {
    alignItems: 'center',
    backgroundColor: '#17233a',
    borderRadius: 26,
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    padding: 20,
  },
  latestMoodPanel: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 22,
    marginTop: 14,
    padding: 18,
  },
  latestMoodTitle: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  latestMoodValue: {
    color: '#17233a',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
  },
  latestMoodNote: {
    color: '#52627a',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  weekKicker: {
    color: '#9fb5d1',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  weekStatNumber: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 4,
  },
  weekStatLabel: {
    color: '#cfe1ff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  weekDivider: {
    backgroundColor: 'rgba(207,225,255,0.18)',
    height: 76,
    width: 1,
  },
  weekMoodBlock: {
    flex: 1,
  },
  weekMoodNumber: {
    color: '#d7ff7a',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  weekDelta: {
    color: '#9fb5d1',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 8,
  },
  trendGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  trendCard: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 22,
    flex: 1,
    minHeight: 136,
    padding: 16,
  },
  trendLabel: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  trendRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  trendNumber: {
    color: '#1976ee',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  trendCaption: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 7,
  },
  trendMeta: {
    color: '#52627a',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 10,
  },
  trendScenario: {
    color: '#17233a',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
  },
  contextPanel: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 26,
    marginTop: 14,
    padding: 20,
  },
  chartPanel: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 26,
    marginTop: 14,
    padding: 20,
  },
  chartBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
    height: 150,
    marginTop: 18,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartTrack: {
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: '100%',
  },
  chartBar: {
    backgroundColor: '#1976ee',
    borderRadius: 999,
    minHeight: 8,
    width: '100%',
  },
  chartBarEmpty: {
    backgroundColor: '#cbd5e1',
  },
  chartLabel: {
    color: '#63728a',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 7,
  },
  aiPanel: {
    backgroundColor: '#17233a',
    borderRadius: 26,
    marginTop: 14,
    padding: 20,
  },
  aiTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
    marginTop: 12,
  },
  aiPanelTitle: {
    color: '#ffffff',
  },
  aiText: {
    color: '#cfe1ff',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  aiSectionTitle: {
    color: '#d7ff7a',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 16,
    textTransform: 'uppercase',
  },
  aiListItem: {
    color: '#dbe8ff',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  aiCaution: {
    color: '#9fb5d1',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 14,
    marginTop: 14,
  },
  contextSubtitle: {
    color: '#63728a',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 18,
    textTransform: 'uppercase',
  },
  contextTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  contextTag: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'rgba(99,114,138,0.14)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  contextTagText: {
    color: '#17233a',
    fontSize: 12,
    fontWeight: '900',
  },
  contextTagCount: {
    color: '#1976ee',
    fontSize: 12,
    fontWeight: '900',
  },
  contextEmpty: {
    color: '#63728a',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
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

function formatChartDay(date: string) {
  const [, month, day] = date.split('-');

  return `${Number(day)}/${Number(month)}`;
}
