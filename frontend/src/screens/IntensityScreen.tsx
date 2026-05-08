import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/ui/ActionButton';
import { copy, intensityByLanguage } from '../i18n';
import { ScreenShell } from '../components/flow/ScreenShell';
import type { Intensity, Language, Scenario } from '../types';

export function IntensityScreen({
  intensity,
  language,
  onBack,
  onNext,
  onSelect,
  scenario,
}: {
  intensity: Intensity;
  language: Language;
  onBack: () => void;
  onNext: () => void;
  onSelect: (value: Intensity) => void;
  scenario: Scenario;
}) {
  const t = copy[language];
  const intensityOptions = intensityByLanguage[language];

  return (
    <ScreenShell onBack={onBack} title={scenario.title}>
      <Text style={styles.largeQuestion}>{t.flow.intensityTitle}</Text>
      <View style={styles.intensityStack}>
        {intensityOptions.map((item) => {
          const selected = intensity === item.id;

          return (
            <Pressable
              key={item.id}
              style={[styles.intensityCard, selected && styles.intensityCardSelected]}
              onPress={() => onSelect(item.id)}
            >
              <Text style={[styles.intensityLabel, selected && styles.choiceTextSelected]}>
                {item.label}
              </Text>
              <Text style={styles.intensityHelper}>{item.helper}</Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label={t.common.continue} onPress={onNext} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  largeQuestion: {
    color: '#17233a',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 36,
  },
  intensityStack: {
    gap: 12,
    marginTop: 28,
  },
  intensityCard: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    padding: 18,
  },
  intensityCardSelected: {
    backgroundColor: '#1976ee',
  },
  intensityLabel: {
    color: '#17233a',
    fontSize: 18,
    fontWeight: '800',
  },
  intensityHelper: {
    color: '#6d7c94',
    fontSize: 14,
    marginTop: 5,
  },
  choiceTextSelected: {
    color: '#ffffff',
  },
});
