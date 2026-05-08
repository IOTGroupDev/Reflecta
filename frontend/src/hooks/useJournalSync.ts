import { useEffect, useState } from 'react';
import {
  deleteJournalSession,
  fetchJournalSessions,
  fetchJournalSummary,
  fetchWeeklyAiSummary,
  postMood,
  type ApiFetch,
} from '../api/reflectaApi';
import type { JournalEntry, JournalSummary, Language, MoodPeriod, WeeklyAiSummary } from '../types';

export type JournalController = ReturnType<typeof useJournalSync>;

export function useJournalSync({
  apiFetch,
  enabled,
  language,
}: {
  apiFetch: ApiFetch;
  enabled: boolean;
  language: Language;
}) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [summary, setSummary] = useState<JournalSummary | null>(null);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [todayMoodByPeriod, setTodayMoodByPeriod] = useState<Partial<Record<MoodPeriod, number>>>({});
  const [weeklyAiSummary, setWeeklyAiSummary] = useState<WeeklyAiSummary | null>(null);
  const [weeklyAiSummaryLoading, setWeeklyAiSummaryLoading] = useState(false);

  const refreshJournal = async () => {
    try {
      if (!enabled) {
        return;
      }

      const nextEntries = await fetchJournalSessions(apiFetch, language);

      if (nextEntries) {
        setEntries(nextEntries);
      }
    } catch {
      // The local in-memory journal still works if the API is unavailable.
    }
  };

  const refreshSummary = async () => {
    try {
      if (!enabled) {
        return;
      }

      const nextSummary = await fetchJournalSummary(apiFetch);

      if (nextSummary) {
        setSummary(nextSummary);
      }
    } catch {
      // Insights remain empty when the API is unavailable.
    }
  };

  useEffect(() => {
    void refreshJournal();
    void refreshSummary();
  }, [enabled, apiFetch, language]);

  const addEntry = (entry: JournalEntry) => {
    setEntries((current) => [entry, ...current]);
  };

  const deleteEntry = async (id: string) => {
    const previousEntries = entries;

    setEntries((current) => current.filter((entry) => entry.id !== id));

    if (!enabled) {
      return;
    }

    const response = await deleteJournalSession(apiFetch, id);

    if (!response.ok) {
      setEntries(previousEntries);
      throw new Error('Delete journal session request failed');
    }

    await refreshSummary();
  };

  const saveMood = (
    value: number,
    options?: {
      note?: string;
      period?: MoodPeriod;
    },
  ) => {
    setTodayMood(value);

    if (options?.period) {
      setTodayMoodByPeriod((current) => ({
        ...current,
        [options.period as MoodPeriod]: value,
      }));
    }

    if (!enabled) {
      return;
    }

    void postMood(apiFetch, value, options)
      .then((response) => {
        if (response.ok) {
          return refreshSummary();
        }

        return undefined;
      })
      .catch(() => undefined);
  };

  const refreshWeeklyAiSummary = async () => {
    if (!enabled || weeklyAiSummaryLoading) {
      return;
    }

    setWeeklyAiSummaryLoading(true);

    try {
      const nextSummary = await fetchWeeklyAiSummary(apiFetch, language);

      if (nextSummary) {
        setWeeklyAiSummary(nextSummary);
      }
    } finally {
      setWeeklyAiSummaryLoading(false);
    }
  };

  const clear = () => {
    setEntries([]);
    setSummary(null);
    setTodayMood(null);
    setTodayMoodByPeriod({});
    setWeeklyAiSummary(null);
    setWeeklyAiSummaryLoading(false);
  };

  return {
    addEntry,
    clear,
    deleteEntry,
    entries,
    refreshJournal,
    refreshSummary,
    refreshWeeklyAiSummary,
    saveMood,
    summary,
    todayMood,
    todayMoodByPeriod,
    weeklyAiSummary,
    weeklyAiSummaryLoading,
  };
}
