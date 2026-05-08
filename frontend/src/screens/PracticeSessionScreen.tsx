import { Text, View, StyleSheet } from 'react-native';
import { ScreenShell } from '../components/flow/ScreenShell';
import { PrimaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { copy } from '../i18n';
import type { Language, PracticePlan, Scenario } from '../types';

export function PracticeSessionScreen({
  onBack,
  onComplete,
  language,
  plan,
  scenario,
}: {
  onBack: () => void;
  onComplete: () => void;
  language: Language;
  plan: PracticePlan;
  scenario: Scenario;
}) {
  const t = copy[language];

  return (
    <ScreenShell onBack={onBack} title={scenario.title}>
      <View style={styles.practiceHero}>
        <ScenarioMark scenario={scenario} />
        <Text style={styles.practiceHeroTitle}>{plan.title}</Text>
        <Text style={styles.practiceHeroDuration}>{plan.duration}</Text>
        <Text style={styles.panelText}>{plan.setup}</Text>
      </View>

      <View style={styles.practiceStepList}>
        {plan.steps.map((step, index) => (
          <View key={step} style={styles.practiceStepItem}>
            <View style={styles.practiceStepNumber}>
              <Text style={styles.practiceStepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.practiceStepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.panelText}>{plan.after}</Text>
      </View>

      <PrimaryButton label={t.practices.complete} onPress={onComplete} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  practiceHero: {
    backgroundColor: 'rgba(247,251,255,0.82)',
    borderRadius: 28,
    padding: 22,
  },
  practiceHeroTitle: {
    color: '#17233a',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
  },
  practiceHeroDuration: {
    color: '#1976ee',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
  },
  panelText: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  practiceStepList: {
    gap: 12,
    marginTop: 16,
  },
  practiceStepItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 22,
    flexDirection: 'row',
    padding: 16,
  },
  practiceStepNumber: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  practiceStepNumberText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  practiceStepText: {
    color: '#52627a',
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  notePanel: {
    backgroundColor: 'rgba(247,251,255,0.7)',
    borderRadius: 24,
    marginTop: 12,
    padding: 18,
  },
});
