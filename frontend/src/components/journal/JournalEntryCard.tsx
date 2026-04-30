import { StyleSheet, Text, View } from 'react-native';
import type { JournalEntry } from '../../types';

export function JournalEntryCard({ entry }: { entry: JournalEntry }) {
  const isPractice = entry.details.includes('Практика');

  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.date}>{entry.createdAt}</Text>
        <Text style={[styles.badge, isPractice && styles.badgePractice]}>
          {isPractice ? 'Практика' : 'Разбор'}
        </Text>
      </View>
      <Text style={styles.title}>{entry.scenario.title}</Text>
      <Text style={styles.body}>{entry.result.title}</Text>
      {entry.details.length > 0 && (
        <Text style={styles.meta}>{entry.details.join(' · ')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    marginBottom: 12,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    color: '#728098',
    fontSize: 13,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#edf5ff',
    borderRadius: 12,
    color: '#63728a',
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgePractice: {
    backgroundColor: '#e8f6f1',
    color: '#2d8268',
  },
  title: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '800',
  },
  body: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  meta: {
    color: '#1976ee',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 10,
  },
});
