import { ScrollView, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { styles } from '../theme/styles';
import type { AnalyzeResult, Scenario } from '../types';

export function ResultScreen({
  onAgain,
  onSave,
  result,
  scenario,
}: {
  onAgain: () => void;
  onSave: () => void;
  result: AnalyzeResult;
  scenario: Scenario;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.resultHeader}>
        <ScenarioMark scenario={scenario} />
        <Text style={styles.resultTitle}>{result.title}</Text>
      </View>

      <ResultBlock title="Что происходит" body={result.what} />
      <ResultBlock title="Почему так" items={result.why} />
      <ResultBlock title="Маленькие шаги" ordered items={result.actions} />

      <View style={styles.reliefPanel}>
        <Text style={styles.reliefEyebrow}>Сейчас</Text>
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
        <SecondaryButton label="Новый разбор" onPress={onAgain} />
        <PrimaryButton compact label="Сохранить" onPress={onSave} />
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
