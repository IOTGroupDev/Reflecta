import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScreenShell } from '../components/flow/ScreenShell';
import { PrimaryButton } from '../components/ui/ActionButton';
import { copy } from '../i18n';
import { activityTagIds, type ActivityTag, type Language, type Scenario } from '../types';

export function NoteScreen({
  loading,
  language,
  note,
  onAnalyze,
  onBack,
  onNote,
  onToggleActivityTag,
  scenario,
  selectedActivityTags,
}: {
  loading: boolean;
  language: Language;
  note: string;
  onAnalyze: () => void;
  onBack: () => void;
  onNote: (value: string) => void;
  onToggleActivityTag: (tag: ActivityTag) => void;
  scenario: Scenario;
  selectedActivityTags: ActivityTag[];
}) {
  const t = copy[language];

  return (
    <ScreenShell onBack={onBack} title={scenario.title}>
      <Text style={styles.largeQuestion}>{t.flow.noteTitle}</Text>
      <Text style={styles.questionHint}>{t.flow.noteHint}</Text>
      <TextInput
        multiline
        onChangeText={onNote}
        placeholder={t.flow.notePlaceholder}
        placeholderTextColor="#8290a6"
        style={styles.noteInput}
        value={note}
      />
      <View style={styles.tagPanel}>
        <Text style={styles.tagTitle}>{t.flow.activityTitle}</Text>
        <Text style={styles.tagHint}>{t.flow.activityHint}</Text>
        <View style={styles.tagGrid}>
          {activityTagIds.map((tag) => {
            const selected = selectedActivityTags.includes(tag);

            return (
              <Pressable
                key={tag}
                style={[styles.tagChip, selected && styles.tagChipSelected]}
                onPress={() => onToggleActivityTag(tag)}
              >
                <Text style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>
                  {t.flow.activityTags[tag]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <PrimaryButton
        label={t.flow.analyze}
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
  tagPanel: {
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 24,
    marginTop: 16,
    padding: 18,
  },
  tagTitle: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '900',
  },
  tagHint: {
    color: '#65748c',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagChip: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(99,114,138,0.14)',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  tagChipSelected: {
    backgroundColor: '#17233a',
    borderColor: '#17233a',
  },
  tagChipText: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '900',
  },
  tagChipTextSelected: {
    color: '#ffffff',
  },
});
