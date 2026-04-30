import { AnalyzeResult, Intensity, Scenario } from '../ai/ai.types';

export interface SaveSessionDto {
  scenario: Scenario;
  details: string[];
  level: Intensity;
  text?: string;
  result: AnalyzeResult;
  userId?: string;
}

export interface SaveMoodDto {
  mood: string;
  rating: number;
  note?: string;
  userId?: string;
}
