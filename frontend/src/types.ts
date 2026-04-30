export type Tab = 'today' | 'chat' | 'practices' | 'journal' | 'insights';
export type ScenarioId = 'anxiety' | 'sleep' | 'burnout';
export type Intensity = 'low' | 'medium' | 'high';

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
  source: 'openai' | 'local';
}

export interface JournalEntry {
  id: string;
  scenario: Scenario;
  level: Intensity;
  details: string[];
  note: string;
  result: AnalyzeResult;
  createdAt: string;
}

export interface ApiSession {
  id: string;
  scenario: ScenarioId;
  details: string[];
  level: Intensity;
  text?: string | null;
  result: AnalyzeResult;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  source: 'openai' | 'local';
  suggestions: string[];
  safety: 'none' | 'crisis';
}

export interface ApiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface JournalSummary {
  averageMood: number | null;
  moodCount: number;
  sessionCount: number;
  topScenario: { id: ScenarioId; count: number } | null;
  latestMood: { rating: number; createdAt: string } | null;
  latestSession: ApiSession | null;
}

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
