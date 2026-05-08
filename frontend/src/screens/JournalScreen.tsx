import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { JournalEntryCard, isPracticeEntry } from '../components/journal/JournalEntryCard';
import { PageHeader } from '../components/ui/PageHeader';
import { copy, getScenarios } from '../i18n';
import type { JournalEntry, Language, Scenario, ScenarioId } from '../types';

type EntryKindFilter = 'all' | 'analysis' | 'practice';
type ScenarioFilter = 'all' | ScenarioId;
type CalendarDay = {
  date: Date;
  key: string;
  inMonth: boolean;
};

export function JournalScreen({
  entries,
  language,
  onBack,
  onDeleteEntry,
  onScenario,
}: {
  entries: JournalEntry[];
  language: Language;
  onBack: () => void;
  onDeleteEntry: (id: string) => Promise<void>;
  onScenario: (scenario: Scenario) => void;
}) {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const [kindFilter, setKindFilter] = useState<EntryKindFilter>('all');
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioFilter>('all');
  const [visibleMonth, setVisibleMonth] = useState(() => getMonthStart(new Date()));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const entriesByDate = useMemo(() => groupEntriesByDate(entries), [entries]);
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth]);
  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const practice = isPracticeEntry(entry);
        const entryDateKey = getDateKey(new Date(entry.createdAtIso));
        const matchesKind =
          kindFilter === 'all' ||
          (kindFilter === 'practice' && practice) ||
          (kindFilter === 'analysis' && !practice);
        const matchesScenario =
          scenarioFilter === 'all' || entry.scenario.id === scenarioFilter;
        const matchesDate = !selectedDateKey || entryDateKey === selectedDateKey;
        const matchesSearch = matchesEntrySearch(entry, searchQuery);

        return matchesKind && matchesScenario && matchesDate && matchesSearch;
      }),
    [entries, kindFilter, scenarioFilter, searchQuery, selectedDateKey],
  );
  const monthLabel = visibleMonth.toLocaleDateString(getLocale(language), {
    month: 'long',
    year: 'numeric',
  });
  const selectedDateEntries = selectedDateKey ? entriesByDate[selectedDateKey] ?? [] : null;
  const confirmDeleteEntry = (entry: JournalEntry) => {
    Alert.alert(
      t.journal.deleteEntryTitle,
      t.journal.deleteEntryBody,
      [
        { text: t.alerts.cancel, style: 'cancel' },
        {
          text: t.alerts.delete,
          style: 'destructive',
          onPress: () => {
            void onDeleteEntry(entry.id).catch(() => {
              Alert.alert(t.journal.deleteEntryFailed);
            });
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <PageHeader
        onBack={onBack}
        title={t.journal.title}
        subtitle={t.journal.subtitle}
      />
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.panelTitle}>{t.journal.emptyTitle}</Text>
          <Text style={styles.panelText}>{t.journal.emptyText}</Text>
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
        <>
          <View style={styles.calendarPanel}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>{t.journal.calendar}</Text>
              <View style={styles.monthControls}>
                <Pressable style={styles.monthButton} onPress={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
                  <Text style={styles.monthButtonText}>{'<'}</Text>
                </Pressable>
                <Text style={styles.monthLabel}>{monthLabel}</Text>
                <Pressable style={styles.monthButton} onPress={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
                  <Text style={styles.monthButtonText}>{'>'}</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day) => {
                const dayEntries = entriesByDate[day.key] ?? [];
                const selected = selectedDateKey === day.key;

                return (
                  <Pressable
                    key={day.key}
                    style={[
                      styles.calendarDay,
                      !day.inMonth && styles.calendarDayMuted,
                      selected && styles.calendarDayActive,
                    ]}
                    onPress={() => setSelectedDateKey(selected ? null : day.key)}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        !day.inMonth && styles.calendarDayTextMuted,
                        selected && styles.calendarDayTextActive,
                      ]}
                    >
                      {day.date.getDate()}
                    </Text>
                    {dayEntries.length > 0 ? (
                      <Text style={[styles.calendarDayCount, selected && styles.calendarDayCountActive]}>
                        {dayEntries.length}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
            {selectedDateKey && selectedDateEntries?.length === 0 ? (
              <Text style={styles.selectedDayEmpty}>{t.journal.selectedDayEmpty}</Text>
            ) : null}
          </View>

          <View style={styles.filters}>
            <View style={styles.filterHeader}>
              <Text style={styles.countText}>{t.journal.entriesCount(filteredEntries.length)}</Text>
            </View>
            <TextInput
              autoCapitalize="none"
              onChangeText={setSearchQuery}
              placeholder={t.journal.searchPlaceholder}
              placeholderTextColor="#8a97aa"
              style={styles.searchInput}
              value={searchQuery}
            />
            <View style={styles.filterRow}>
              {([
                ['all', t.journal.all],
                ['analysis', t.journal.analysis],
                ['practice', t.journal.practice],
              ] as const).map(([value, label]) => (
                <Pressable
                  key={value}
                  style={[styles.filterChip, kindFilter === value && styles.filterChipActive]}
                  onPress={() => setKindFilter(value)}
                >
                  <Text style={[styles.filterChipText, kindFilter === value && styles.filterChipTextActive]}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.filterRow}>
              <Pressable
                style={[styles.filterChip, scenarioFilter === 'all' && styles.filterChipActive]}
                onPress={() => setScenarioFilter('all')}
              >
                <Text style={[styles.filterChipText, scenarioFilter === 'all' && styles.filterChipTextActive]}>
                  {t.journal.allStates}
                </Text>
              </Pressable>
              {scenarios.map((scenario) => (
                <Pressable
                  key={scenario.id}
                  style={[styles.filterChip, scenarioFilter === scenario.id && styles.filterChipActive]}
                  onPress={() => setScenarioFilter(scenario.id)}
                >
                  <Text style={[styles.filterChipText, scenarioFilter === scenario.id && styles.filterChipTextActive]}>
                    {scenario.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {filteredEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.panelTitle}>{t.journal.filteredEmptyTitle}</Text>
              <Text style={styles.panelText}>{t.journal.filteredEmptyText}</Text>
            </View>
          ) : (
            filteredEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                language={language}
                onDelete={confirmDeleteEntry}
              />
            ))
          )}
        </>
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
  calendarPanel: {
    backgroundColor: 'rgba(247,251,255,0.82)',
    borderRadius: 26,
    gap: 14,
    marginBottom: 14,
    padding: 16,
  },
  calendarHeader: {
    gap: 10,
  },
  calendarTitle: {
    color: '#17233a',
    fontSize: 18,
    fontWeight: '900',
  },
  monthControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  monthButton: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 14,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  monthButtonText: {
    color: '#1976ee',
    fontSize: 18,
    fontWeight: '900',
  },
  monthLabel: {
    color: '#17233a',
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  calendarDay: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderColor: 'rgba(99,114,138,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    width: '13.2%',
  },
  calendarDayMuted: {
    backgroundColor: 'rgba(255,255,255,0.48)',
  },
  calendarDayActive: {
    backgroundColor: '#17233a',
    borderColor: '#17233a',
  },
  calendarDayText: {
    color: '#17233a',
    fontSize: 12,
    fontWeight: '900',
  },
  calendarDayTextMuted: {
    color: '#9aa6b7',
  },
  calendarDayTextActive: {
    color: '#ffffff',
  },
  calendarDayCount: {
    color: '#1976ee',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },
  calendarDayCountActive: {
    color: '#d7ff7a',
  },
  selectedDayEmpty: {
    color: '#63728a',
    fontSize: 13,
    fontWeight: '800',
  },
  filters: {
    gap: 10,
    marginBottom: 14,
  },
  filterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countText: {
    color: '#63728a',
    fontSize: 13,
    fontWeight: '900',
  },
  searchInput: {
    backgroundColor: 'rgba(247,251,255,0.86)',
    borderColor: 'rgba(99,114,138,0.14)',
    borderRadius: 16,
    borderWidth: 1,
    color: '#17233a',
    fontSize: 14,
    fontWeight: '700',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderColor: 'rgba(99,114,138,0.12)',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: '#17233a',
    borderColor: '#17233a',
  },
  filterChipText: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '900',
  },
  filterChipTextActive: {
    color: '#ffffff',
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

function groupEntriesByDate(entries: JournalEntry[]) {
  return entries.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
    const key = getDateKey(new Date(entry.createdAtIso));

    acc[key] = [...(acc[key] ?? []), entry];
    return acc;
  }, {});
}

function getCalendarDays(month: Date): CalendarDay[] {
  const firstDay = getMonthStart(month);
  const start = new Date(firstDay);
  const day = start.getDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;

  start.setDate(start.getDate() - daysSinceMonday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);

    date.setDate(start.getDate() + index);

    return {
      date,
      key: getDateKey(date),
      inMonth: date.getMonth() === firstDay.getMonth(),
    };
  });
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getLocale(language: Language) {
  if (language === 'en') {
    return 'en-US';
  }

  if (language === 'es') {
    return 'es-ES';
  }

  return 'ru-RU';
}

function matchesEntrySearch(entry: JournalEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    entry.scenario.title,
    entry.scenario.subtitle,
    entry.level,
    entry.note,
    entry.result.title,
    entry.result.what,
    entry.result.note,
    ...entry.details,
    ...entry.result.why,
    ...entry.result.actions,
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}
