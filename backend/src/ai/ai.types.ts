export type Scenario = 'anxiety' | 'sleep' | 'burnout';
export type Intensity = 'low' | 'medium' | 'high';
export type Language = 'ru' | 'en' | 'es';
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

export interface AnalyzeDto {
  scenario: Scenario;
  details: string[];
  activityTags?: ActivityTag[];
  language?: Language;
  level: Intensity;
  text?: string;
  userId: string;
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

export interface WeeklySummaryInput {
  language?: Language;
  moodSeries: Array<{ date: string; averageMood: number | null; count: number }>;
  topTags: Array<{ id: string; count: number }>;
  highIntensityTags: Array<{ id: string; count: number }>;
  sessions: Array<{
    scenario: Scenario;
    level: Intensity;
    details: string[];
    activityTags: string[];
    text?: string | null;
    createdAt: string;
  }>;
}

export interface WeeklySummaryResponse {
  source: 'deepseek' | 'openai' | 'local';
  summary: {
    title: string;
    pattern: string;
    helped: string[];
    next: string[];
    caution: string;
  };
}
