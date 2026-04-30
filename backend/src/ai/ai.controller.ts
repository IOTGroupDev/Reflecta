import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AnalyzeDto } from './ai.types';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('analyze')
  analyze(@Body() dto: AnalyzeDto) {
    return this.ai.analyze(dto);
  }
}
