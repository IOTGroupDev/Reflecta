export type Tab = 'today' | 'chat' | 'practices' | 'journal' | 'insights' | 'profile';
export type Language = 'ru' | 'en' | 'es';
export type ScenarioId = 'anxiety' | 'sleep' | 'burnout';
export type Intensity = 'low' | 'medium' | 'high';
export type OnboardingGoal = 'calm' | 'sleep' | 'burnout' | 'journal';
export type MoodPeriod = 'morning' | 'evening';
export type ActivityTag =
  | 'work'
  | 'relationships'
  | 'health'
  | 'sleep'
  | 'food'
  | 'caffeine'
  | 'movement'
  | 'alone'
  | 'overload';

export type Step = 'home' | 'details' | 'intensity' | 'note' | 'result';

export interface Scenario {
  id: ScenarioId;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  details: Array<{ id: string; label: string }>;
}

export interface AnalyzeResult {
  title: string;
  what: string;
  why: string[];
  actions: string[];
  relief: {
    title: string;
    duration: string;
    steps: string[];
  };
  note: string;
}

export interface AnalyzeResponse {
  result: AnalyzeResult;
  source: 'deepseek' | 'openai' | 'local';
}

export interface JournalEntry {
  id: string;
  scenario: Scenario;
  level: Intensity;
  details: string[];
  note: string;
  result: AnalyzeResult;
  createdAt: string;
  createdAtIso: string;
  activityTags: ActivityTag[];
}

export interface ApiSession {
  id: string;
  scenario: ScenarioId;
  details: string[];
  level: Intensity;
  text?: string | null;
  result: AnalyzeResult;
  createdAt: string;
  activityTags?: ActivityTag[] | null;
}

export interface ChatMessage {
  attachments?: ChatAttachment[];
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAttachment {
  id: string;
  kind: 'document' | 'image';
  mimeType?: string;
  name: string;
  size?: number;
  url: string;
}

export interface ChatResponse {
  message: string;
  source: 'deepseek' | 'openai' | 'local';
  suggestions: string[];
  safety: 'none' | 'crisis';
}

export interface ApiChatMessage {
  attachments?: ChatAttachment[] | null;
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface JournalSummary {
  averageMood: number | null;
  moodCount: number;
  sessionCount: number;
  topScenario: { id: ScenarioId; count: number } | null;
  latestMood: { rating: number; period?: MoodPeriod | null; note?: string | null; createdAt: string } | null;
  latestSession: ApiSession | null;
  week?: {
    since: string;
    averageMood: number | null;
    previousAverageMood: number | null;
    moodDelta: number | null;
    moodCount: number;
    sessionCount: number;
    topScenario: { id: ScenarioId; count: number } | null;
  };
  windows?: {
    sevenDays: JournalSummaryWindow;
    thirtyDays: JournalSummaryWindow;
  };
  tagPatterns?: {
    topTags: Array<{ id: ActivityTag; count: number }>;
    highIntensityTags: Array<{ id: ActivityTag; count: number }>;
  };
  moodSeries?: JournalMoodPoint[];
}

export interface JournalMoodPoint {
  date: string;
  averageMood: number | null;
  count: number;
}

export interface WeeklyAiSummary {
  source: 'deepseek' | 'openai' | 'local';
  summary: {
    title: string;
    pattern: string;
    helped: string[];
    next: string[];
    caution: string;
  };
}

export interface MarkdownExport {
  exportedAt: string;
  markdown: string;
}

export interface JournalSummaryWindow {
  since: string;
  averageMood: number | null;
  moodCount: number;
  sessionCount: number;
  topScenario: { id: ScenarioId; count: number } | null;
  topTags: Array<{ id: ActivityTag; count: number }>;
}

export const activityTagIds: ActivityTag[] = [
  'work',
  'relationships',
  'health',
  'sleep',
  'food',
  'caffeine',
  'movement',
  'alone',
  'overload',
];

export interface PracticePlan {
  title: string;
  duration: string;
  setup: string;
  steps: string[];
  after: string;
}

export interface DailyPlan {
  scenario: Scenario;
  title: string;
  body: string;
  reason: string;
  action: string;
}

export interface WeeklyReflection {
  title: string;
  points: string[];
  next: string;
}

export interface UserProfile {
  onboardingGoal: OnboardingGoal | null;
  timezone: string | null;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string | null;
  privacyAcceptedAt: string | null;
}

export interface MeProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  profile: UserProfile | null;
  counts: {
    sessions: number;
    moods: number;
    chats: number;
  };
}
