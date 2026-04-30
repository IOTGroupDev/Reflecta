export type Scenario = 'anxiety' | 'sleep' | 'burnout';
export type Intensity = 'low' | 'medium' | 'high';

export interface AnalyzeDto {
  scenario: Scenario;
  details: string[];
  level: Intensity;
  text?: string;
  userId?: string;
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
