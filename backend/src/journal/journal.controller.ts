import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { AiService } from '../ai/ai.service';
import { Language } from '../ai/ai.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RateLimit } from '../rate-limit/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { JournalService } from './journal.service';
import { SaveMoodDto, SaveSessionDto } from './journal.types';

@Controller('journal')
@UseGuards(SupabaseAuthGuard)
export class JournalController {
  constructor(
    private readonly ai: AiService,
    private readonly journal: JournalService,
  ) {}

  @Get('sessions')
  listSessions(@CurrentUser() user: AuthUser) {
    return this.journal.listSessions(user.id);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.journal.summary(user.id);
  }

  @Get('weekly-summary')
  @UseGuards(RateLimitGuard)
  @RateLimit({ name: 'journal-weekly-summary', limit: 8, windowSeconds: 60 * 60 })
  async weeklySummary(
    @CurrentUser() user: AuthUser,
    @Query('language') language?: Language,
  ) {
    const input = await this.journal.weeklySummaryInput(user.id, language);

    return this.ai.summarizeWeek(input);
  }

  @Post('sessions')
  saveSession(@Body() dto: SaveSessionDto, @CurrentUser() user: AuthUser) {
    return this.journal.saveSession({ ...dto, userId: user.id });
  }

  @Delete('sessions/:id')
  deleteSession(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.journal.deleteSession(user.id, id);
  }

  @Post('moods')
  saveMood(@Body() dto: SaveMoodDto, @CurrentUser() user: AuthUser) {
    return this.journal.saveMood({ ...dto, userId: user.id });
  }
}
