import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { copy } from '../../i18n';
import type { JournalEntry, Language } from '../../types';

export function JournalEntryCard({
  entry,
  language,
  onDelete,
}: {
  entry: JournalEntry;
  language: Language;
  onDelete?: (entry: JournalEntry) => void;
}) {
  const t = copy[language];
  const [expanded, setExpanded] = useState(false);
  const isPractice = isPracticeEntry(entry);

  return (
    <Pressable style={styles.item} onPress={() => setExpanded((current) => !current)}>
      <View style={styles.header}>
        <Text style={styles.date}>{entry.createdAt}</Text>
        <Text style={[styles.badge, isPractice && styles.badgePractice]}>
          {isPractice ? t.journal.practice : t.journal.analysis}
        </Text>
      </View>
      <Text style={styles.title}>{entry.scenario.title}</Text>
      <Text style={styles.body}>{entry.result.title}</Text>
      {entry.details.length > 0 && (
        <Text style={styles.meta}>{entry.details.join(' · ')}</Text>
      )}
      {entry.activityTags.length > 0 ? (
        <View style={styles.tagRow}>
          {entry.activityTags.map((tag) => (
            <Text key={tag} style={styles.tagText}>
              {t.flow.activityTags[tag]}
            </Text>
          ))}
        </View>
      ) : null}
      {expanded ? (
        <View style={styles.expanded}>
          {entry.note ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>{t.journal.note}</Text>
              <Text style={styles.blockText}>{entry.note}</Text>
            </View>
          ) : null}
          <View style={styles.block}>
            <Text style={styles.blockLabel}>{t.result.what}</Text>
            <Text style={styles.blockText}>{entry.result.what}</Text>
          </View>
          <View style={styles.block}>
            <Text style={styles.blockLabel}>{t.result.steps}</Text>
            {entry.result.actions.map((action) => (
              <Text key={action} style={styles.stepText}>
                {action}
              </Text>
            ))}
          </View>
          {onDelete ? (
            <Pressable
              style={styles.deleteButton}
              onPress={(event) => {
                event.stopPropagation();
                onDelete(entry);
              }}
            >
              <Text style={styles.deleteButtonText}>{t.journal.deleteEntry}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <Text style={styles.toggle}>{expanded ? t.journal.close : t.journal.open}</Text>
    </Pressable>
  );
}

export function isPracticeEntry(entry: JournalEntry) {
  return entry.details.some((detail) =>
    ['практика', 'practice', 'práctica'].includes(detail.toLowerCase()),
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
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagText: {
    backgroundColor: '#eef2f7',
    borderRadius: 12,
    color: '#526178',
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  expanded: {
    borderTopColor: 'rgba(99,114,138,0.16)',
    borderTopWidth: 1,
    gap: 14,
    marginTop: 14,
    paddingTop: 14,
  },
  block: {
    gap: 6,
  },
  blockLabel: {
    color: '#17233a',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  blockText: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 21,
  },
  stepText: {
    color: '#526178',
    fontSize: 14,
    lineHeight: 21,
  },
  toggle: {
    color: '#1976ee',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 12,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff1f2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteButtonText: {
    color: '#be123c',
    fontSize: 12,
    fontWeight: '900',
  },
});
