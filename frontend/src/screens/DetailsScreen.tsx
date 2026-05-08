import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/flow/ScreenShell';
import { PrimaryButton } from '../components/ui/ActionButton';
import { copy } from '../i18n';
import type { Language, Scenario } from '../types';

export function DetailsScreen({
  onBack,
  language,
  onNext,
  onToggle,
  scenario,
  selectedDetails,
}: {
  onBack: () => void;
  language: Language;
  onNext: () => void;
  onToggle: (id: string) => void;
  scenario: Scenario;
  selectedDetails: string[];
}) {
  const t = copy[language];

  return (
    <ScreenShell onBack={onBack} title={scenario.title}>
      <Text style={styles.largeQuestion}>{t.flow.detailsTitle}</Text>
      <Text style={styles.questionHint}>{t.flow.detailsHint}</Text>
      <View style={styles.optionList}>
        {scenario.details.map((detail) => {
          const selected = selectedDetails.includes(detail.id);

          return (
            <Pressable
              key={detail.id}
              style={[styles.choice, selected && styles.choiceSelected]}
              onPress={() => onToggle(detail.id)}
            >
              <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
                {detail.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <PrimaryButton label={t.common.next} onPress={onNext} />
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
  questionHint: {
    color: '#65748c',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  optionList: {
    gap: 12,
    marginTop: 28,
  },
  choice: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 22,
    justifyContent: 'center',
    minHeight: 58,
    paddingHorizontal: 18,
  },
  choiceSelected: {
    backgroundColor: '#1976ee',
  },
  choiceText: {
    color: '#17233a',
    fontSize: 16,
    fontWeight: '800',
  },
  choiceTextSelected: {
    color: '#ffffff',
  },
});
