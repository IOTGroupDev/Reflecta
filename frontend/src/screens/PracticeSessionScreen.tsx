import { Pressable, Text, View } from 'react-native';
import { ScreenShell } from '../components/flow/ScreenShell';
import { PrimaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { styles } from '../theme/styles';
import type { PracticePlan, Scenario } from '../types';

export function PracticeSessionScreen({
  onBack,
  onComplete,
  plan,
  scenario,
}: {
  onBack: () => void;
  onComplete: () => void;
  plan: PracticePlan;
  scenario: Scenario;
}) {
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

      <PrimaryButton label="Завершить и сохранить" onPress={onComplete} />
    </ScreenShell>
  );
}
