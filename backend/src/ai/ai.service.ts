import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AnalyzeDto, AnalyzeResponse, AnalyzeResult } from './ai.types';
import {
  analyzeResultJsonSchema,
  buildAnalyzePrompt,
  buildLocalResult,
} from './scenarios';

@Injectable()
export class AiService {
  private readonly openai?: OpenAI;
  private readonly model: string;

  constructor(config: ConfigService) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    this.model = config.get<string>('OPENAI_MODEL', 'gpt-4o-mini');

    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async analyze(dto: AnalyzeDto): Promise<AnalyzeResponse> {
    if (!this.openai) {
      return {
        result: buildLocalResult(dto),
        source: 'local',
      };
    }

    try {
      const response = await this.openai.responses.create({
        model: this.model,
        input: buildAnalyzePrompt(dto),
        text: {
          format: {
            type: 'json_schema',
            name: 'reflecta_analysis',
            strict: true,
            schema: analyzeResultJsonSchema,
          },
        },
      });

      return {
        result: JSON.parse(response.output_text) as AnalyzeResult,
        source: 'openai',
      };
    } catch {
      return {
        result: buildLocalResult(dto),
        source: 'local',
      };
    }
  }
}
