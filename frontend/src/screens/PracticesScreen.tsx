import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PageHeader } from '../components/ui/PageHeader';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { copy, getScenarios, practicePlansByLanguage } from '../i18n';
import type { Language, Scenario } from '../types';

export function PracticesScreen({
  onBack,
  language,
  onPractice,
  onScenario,
}: {
  onBack: () => void;
  language: Language;
  onPractice: (scenario: Scenario) => void;
  onScenario: (scenario: Scenario) => void;
}) {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const practicePlans = practicePlansByLanguage[language];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        onBack={onBack}
        title={t.practices.title}
        subtitle={t.practices.subtitle}
      />
      {scenarios.map((scenario) => (
        <View key={scenario.id} style={styles.practiceItem}>
          <ScenarioMark scenario={scenario} />
          <View style={styles.practiceCopy}>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            <Text style={styles.scenarioSubtitle}>{scenario.subtitle}</Text>
            <Text style={styles.practiceMeta}>{practicePlans[scenario.id].title}</Text>
          </View>
          <View style={styles.practiceActions}>
            <Pressable style={styles.practiceStartButton} onPress={() => onPractice(scenario)}>
              <Text style={styles.practiceStartText}>{practicePlans[scenario.id].duration}</Text>
            </Pressable>
            <Pressable style={styles.practiceAnalyzeButton} onPress={() => onScenario(scenario)}>
              <Text style={styles.practiceAnalyzeText}>{t.common.analysis}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  practiceItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  practiceCopy: {
    flex: 1,
    marginLeft: 4,
  },
  scenarioTitle: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '800',
  },
  scenarioSubtitle: {
    color: '#697890',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  practiceMeta: {
    color: '#1976ee',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },
  practiceActions: {
    alignItems: 'flex-end',
    gap: 8,
    marginLeft: 10,
  },
  practiceStartButton: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
  },
  practiceStartText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  practiceAnalyzeButton: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  practiceAnalyzeText: {
    color: '#6e7d94',
    fontSize: 12,
    fontWeight: '800',
  },
});
