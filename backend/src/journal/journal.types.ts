import { ActivityTag, AnalyzeResult, Intensity, Scenario } from '../ai/ai.types';

export interface SaveSessionDto {
  scenario: Scenario;
  details: string[];
  activityTags?: ActivityTag[];
  level: Intensity;
  text?: string;
  result: AnalyzeResult;
  userId: string;
}

export interface SaveMoodDto {
  mood: string;
  period?: 'morning' | 'evening';
  rating: number;
  note?: string;
  userId: string;
}
