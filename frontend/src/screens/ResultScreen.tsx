import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { copy } from '../i18n';
import type { AnalyzeResult, Language, Scenario } from '../types';

export function ResultScreen({
  language,
  onAgain,
  onBack,
  onSave,
  result,
  scenario,
}: {
  language: Language;
  onAgain: () => void;
  onBack: () => void;
  onSave: () => void;
  result: AnalyzeResult;
  scenario: Scenario;
}) {
  const t = copy[language];

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.resultHeader}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <View style={styles.resultHeaderCopy}>
          <ScenarioMark scenario={scenario} />
          <Text style={styles.resultTitle}>{result.title}</Text>
        </View>
      </View>

      <ResultBlock title={t.result.what} body={result.what} />
      <ResultBlock title={t.result.why} items={result.why} />
      <ResultBlock title={t.result.steps} ordered items={result.actions} />

      <View style={styles.reliefPanel}>
        <Text style={styles.reliefEyebrow}>{t.result.now}</Text>
        <Text style={styles.panelTitle}>{result.relief.title}</Text>
        <Text style={styles.panelText}>{result.relief.duration}</Text>
        {result.relief.steps.map((step) => (
          <Text key={step} style={styles.reliefStep}>
            {step}
          </Text>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.panelText}>{result.note}</Text>
      </View>

      <View style={styles.actionRow}>
        <SecondaryButton label={t.common.newAnalysis} onPress={onAgain} />
        <PrimaryButton compact label={t.common.save} onPress={onSave} />
      </View>
    </ScrollView>
  );
}

function ResultBlock({
  body,
  items,
  ordered,
  title,
}: {
  body?: string;
  items?: string[];
  ordered?: boolean;
  title: string;
}) {
  return (
    <View style={styles.resultBlock}>
      <Text style={styles.resultBlockTitle}>{title}</Text>
      {body && <Text style={styles.resultBody}>{body}</Text>}
      {items?.map((item, index) => (
        <Text key={item} style={styles.resultBody}>
          {ordered ? `${index + 1}. ` : ''}{item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  resultHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  resultHeaderCopy: {
    flex: 1,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 20,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonText: {
    color: '#17233a',
    fontSize: 34,
    lineHeight: 36,
  },
  resultTitle: {
    color: '#17233a',
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 37,
    marginTop: 10,
  },
  resultBlock: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    marginBottom: 12,
    padding: 18,
  },
  resultBlockTitle: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  resultBody: {
    color: '#52627a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  reliefPanel: {
    backgroundColor: '#17233a',
    borderRadius: 26,
    marginTop: 4,
    padding: 20,
  },
  reliefEyebrow: {
    color: '#8fc0ff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
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
  reliefStep: {
    color: '#dbe8ff',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  notePanel: {
    backgroundColor: 'rgba(247,251,255,0.7)',
    borderRadius: 24,
    marginTop: 12,
    padding: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
