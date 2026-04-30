import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { JournalService } from './journal.service';
import { SaveMoodDto, SaveSessionDto } from './journal.types';

@Controller('journal')
@UseGuards(SupabaseAuthGuard)
export class JournalController {
  constructor(private readonly journal: JournalService) {}

  @Get('sessions')
  listSessions(@CurrentUser() user: AuthUser) {
    return this.journal.listSessions(user.id);
  }

  @Get('summary')
  summary(@CurrentUser() user: AuthUser) {
    return this.journal.summary(user.id);
  }

  @Post('sessions')
  saveSession(@Body() dto: SaveSessionDto, @CurrentUser() user: AuthUser) {
    return this.journal.saveSession({ ...dto, userId: user.id });
  }

  @Post('moods')
  saveMood(@Body() dto: SaveMoodDto, @CurrentUser() user: AuthUser) {
    return this.journal.saveMood({ ...dto, userId: user.id });
  }
}
