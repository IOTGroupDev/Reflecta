import { StyleSheet, Text, TextInput } from 'react-native';
import { ScreenShell } from '../components/flow/ScreenShell';
import { PrimaryButton } from '../components/ui/ActionButton';
import type { Scenario } from '../types';

export function NoteScreen({
  loading,
  note,
  onAnalyze,
  onBack,
  onNote,
  scenario,
}: {
  loading: boolean;
  note: string;
  onAnalyze: () => void;
  onBack: () => void;
  onNote: (value: string) => void;
  scenario: Scenario;
}) {
  return (
    <ScreenShell onBack={onBack} title={scenario.title}>
      <Text style={styles.largeQuestion}>Хочешь добавить одну фразу?</Text>
      <Text style={styles.questionHint}>Это необязательно, но поможет точнее подобрать ответ.</Text>
      <TextInput
        multiline
        onChangeText={onNote}
        placeholder="Например: боюсь, что завтра снова не справлюсь"
        placeholderTextColor="#8290a6"
        style={styles.noteInput}
        value={note}
      />
      <PrimaryButton
        label="Разобрать состояние"
        loading={loading}
        onPress={onAnalyze}
      />
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
  noteInput: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    color: '#17233a',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 28,
    minHeight: 160,
    padding: 18,
    textAlignVertical: 'top',
  },
});
