import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { JournalEntryCard } from '../components/journal/JournalEntryCard';
import { PageHeader } from '../components/ui/PageHeader';
import { scenarios } from '../data';
import type { JournalEntry, Scenario } from '../types';

export function JournalScreen({
  entries,
  onScenario,
}: {
  entries: JournalEntry[];
  onScenario: (scenario: Scenario) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        title="Дневник эмоций"
        subtitle="Сохранённые разборы и то, что постепенно становится заметно."
      />
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.panelTitle}>Пока пусто</Text>
          <Text style={styles.panelText}>
            Сохрани первый разбор, и здесь появится история состояния. Начать можно с самого частого сценария.
          </Text>
          <View style={styles.emptyActions}>
            {scenarios.map((scenario) => (
              <Pressable
                key={scenario.id}
                style={styles.emptyAction}
                onPress={() => onScenario(scenario)}
              >
                <Text style={styles.emptyActionText}>{scenario.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        entries.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  emptyState: {
    backgroundColor: 'rgba(247, 251, 255, 0.78)',
    borderRadius: 26,
    padding: 22,
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
  emptyActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  emptyAction: {
    backgroundColor: '#edf5ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emptyActionText: {
    color: '#1976ee',
    fontSize: 13,
    fontWeight: '800',
  },
});
