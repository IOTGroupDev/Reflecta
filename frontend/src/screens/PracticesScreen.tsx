import { Pressable, ScrollView, Text, View } from 'react-native';
import { PageHeader } from '../components/ui/PageHeader';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { practicePlans, scenarios } from '../data';
import { styles } from '../theme/styles';
import type { Scenario } from '../types';

export function PracticesScreen({
  onPractice,
  onScenario,
}: {
  onPractice: (scenario: Scenario) => void;
  onScenario: (scenario: Scenario) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Практики"
        subtitle="Короткие сценарии, когда нужно не объяснять всё заново."
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
              <Text style={styles.practiceAnalyzeText}>Разбор</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
