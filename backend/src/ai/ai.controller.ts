import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RateLimit } from '../rate-limit/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { AiService } from './ai.service';
import { AnalyzeDto } from './ai.types';

@Controller('ai')
@UseGuards(SupabaseAuthGuard, RateLimitGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('analyze')
  @RateLimit({ name: 'ai-analyze', limit: 20, windowSeconds: 60 * 60 })
  analyze(@Body() dto: AnalyzeDto, @CurrentUser() user: AuthUser) {
    return this.ai.analyze({ ...dto, userId: user.id });
  }
}
