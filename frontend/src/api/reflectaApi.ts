import { fallbackResultsByLanguage, getScenarios } from '../i18n';
import { apiUrl } from '../lib/supabase';
import type {
  AnalyzeResponse,
  AnalyzeResult,
  ApiChatMessage,
  ApiSession,
  ChatResponse,
  Intensity,
  JournalEntry,
  JournalSummary,
  Language,
  MeProfile,
  MarkdownExport,
  MoodPeriod,
  OnboardingGoal,
  Scenario,
  ActivityTag,
  ChatAttachment,
  WeeklyAiSummary,
} from '../types';

export type ApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export function createApiFetch(accessToken?: string): ApiFetch {
  return (path, init) => {
    const headers = new Headers(init?.headers);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return fetch(buildApiUrl(path), {
      ...init,
      headers,
    });
  };
}

function buildApiUrl(path: string) {
  return `${apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function analyzeState({
  apiFetch,
  details,
  activityTags,
  intensity,
  language = 'ru',
  note,
  scenario,
}: {
  apiFetch: ApiFetch;
  details: string[];
  activityTags: ActivityTag[];
  intensity: Intensity;
  language?: Language;
  note: string;
  scenario: Scenario;
}): Promise<AnalyzeResult> {
  try {
    const response = await apiFetch('/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: scenario.id,
        activityTags,
        details,
        language,
        level: intensity,
        text: note,
      }),
    });

    if (!response.ok) {
      throw new Error('Analyze request failed');
    }

    const payload = (await response.json()) as AnalyzeResponse;
    return payload.result;
  } catch {
    return fallbackResultsByLanguage[language][scenario.id];
  }
}

export async function fetchJournalSessions(apiFetch: ApiFetch, language: Language = 'ru'): Promise<JournalEntry[] | null> {
  const response = await apiFetch('/journal/sessions');

  if (!response.ok) {
    return null;
  }

  const sessions = (await response.json()) as ApiSession[];
  return sessions.map((session) => mapApiSessionToEntry(session, language));
}

export async function fetchJournalSummary(apiFetch: ApiFetch): Promise<JournalSummary | null> {
  const response = await apiFetch('/journal/summary');

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as JournalSummary;
}

export async function fetchWeeklyAiSummary(
  apiFetch: ApiFetch,
  language: Language,
): Promise<WeeklyAiSummary | null> {
  const response = await apiFetch(`/journal/weekly-summary?language=${encodeURIComponent(language)}`);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as WeeklyAiSummary;
}

export async function fetchChatHistory(apiFetch: ApiFetch) {
  const response = await apiFetch('/chat/history');

  if (!response.ok) {
    return null;
  }

  const messages = (await response.json()) as ApiChatMessage[];
  return messages.map((message) => ({
    attachments: message.attachments ?? [],
    id: message.id,
    role: message.role,
    content: message.content,
  }));
}

export async function postJournalSession({
  apiFetch,
  details,
  activityTags,
  level,
  result,
  scenario,
  text,
}: {
  apiFetch: ApiFetch;
  details: string[];
  activityTags: ActivityTag[];
  level: Intensity;
  result: AnalyzeResult;
  scenario: Scenario;
  text: string;
}) {
  return apiFetch('/journal/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scenario: scenario.id,
      activityTags,
      details,
      level,
      text,
      result,
    }),
  });
}

export async function deleteJournalSession(apiFetch: ApiFetch, id: string) {
  return apiFetch(`/journal/sessions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function postMood(
  apiFetch: ApiFetch,
  value: number,
  options?: {
    note?: string;
    period?: MoodPeriod;
  },
) {
  return apiFetch('/journal/moods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mood: value <= 2 ? 'low' : value === 3 ? 'neutral' : 'good',
      note: options?.note,
      period: options?.period,
      rating: value,
    }),
  });
}

export async function fetchMe(apiFetch: ApiFetch): Promise<MeProfile | null> {
  const response = await apiFetch('/me');

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as MeProfile;
}

export async function exportMe(apiFetch: ApiFetch) {
  const response = await apiFetch('/me/export');

  if (!response.ok) {
    throw new Error('Export request failed');
  }

  return response.json() as Promise<unknown>;
}

export async function exportMeMarkdown(apiFetch: ApiFetch) {
  const response = await apiFetch('/me/export/markdown');

  if (!response.ok) {
    throw new Error('Markdown export request failed');
  }

  return response.json() as Promise<MarkdownExport>;
}

export async function updatePreferences(
  apiFetch: ApiFetch,
  preferences: {
    onboardingGoal?: OnboardingGoal;
    timezone?: string;
    dailyReminderEnabled?: boolean;
    dailyReminderTime?: string;
    privacyAccepted?: boolean;
  },
) {
  return apiFetch('/me/preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
}

export async function updateMe(
  apiFetch: ApiFetch,
  profile: {
    avatarUrl?: string | null;
    name?: string;
  },
) {
  return apiFetch('/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
}

export async function deleteMe(apiFetch: ApiFetch) {
  return apiFetch('/me', {
    method: 'DELETE',
  });
}

export async function deleteMyData(apiFetch: ApiFetch) {
  return apiFetch('/me/data', {
    method: 'DELETE',
  });
}

export async function postChatMessage({
  apiFetch,
  history,
  language = 'ru',
  message,
  attachments = [],
}: {
  attachments?: ChatAttachment[];
  apiFetch: ApiFetch;
  history: Array<{ role: 'assistant' | 'user'; content: string }>;
  language?: Language;
  message: string;
}): Promise<ChatResponse> {
  const response = await apiFetch('/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attachments, message, history, language }),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  return (await response.json()) as ChatResponse;
}

export function createJournalEntry({
  details,
  activityTags,
  level,
  note,
  result,
  scenario,
  suffix = '',
}: {
  details: string[];
  activityTags: ActivityTag[];
  level: Intensity;
  note: string;
  result: AnalyzeResult;
  scenario: Scenario;
  suffix?: string;
}): JournalEntry {
  const createdAt = new Date();

  return {
    id: `${Date.now()}${suffix}`,
    scenario,
    level,
    details,
    activityTags,
    note,
    result,
    createdAt: formatJournalDate(createdAt),
    createdAtIso: createdAt.toISOString(),
  };
}

function mapApiSessionToEntry(session: ApiSession, language: Language) {
  const scenarios = getScenarios(language);
  const scenario = scenarios.find((item) => item.id === session.scenario) ?? scenarios[0];

  return {
    id: session.id,
    scenario,
    level: session.level,
    details: session.details,
    activityTags: session.activityTags ?? [],
    note: session.text ?? '',
    result: session.result,
    createdAt: formatJournalDate(new Date(session.createdAt)),
    createdAtIso: session.createdAt,
  };
}

function formatJournalDate(date: Date) {
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
