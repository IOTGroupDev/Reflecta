import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { MeService } from './me.service';
import { UpdateMeDto, UpdatePreferencesDto } from './me.types';

@Controller('me')
@UseGuards(SupabaseAuthGuard)
export class MeController {
  constructor(private readonly me: MeService) {}

  @Get('export')
  exportMe(@CurrentUser() user: AuthUser) {
    return this.me.exportData(user.id);
  }

  @Get('export/markdown')
  exportMarkdown(@CurrentUser() user: AuthUser) {
    return this.me.exportMarkdown(user.id);
  }

  @Get()
  getMe(@CurrentUser() user: AuthUser) {
    return this.me.getProfile(user.id);
  }

  @Patch()
  updateMe(@Body() dto: UpdateMeDto, @CurrentUser() user: AuthUser) {
    return this.me.updateMe(user.id, dto);
  }

  @Patch('preferences')
  updatePreferences(@Body() dto: UpdatePreferencesDto, @CurrentUser() user: AuthUser) {
    return this.me.updatePreferences(user.id, dto);
  }

  @Delete('data')
  deleteData(@CurrentUser() user: AuthUser) {
    return this.me.deleteData(user.id);
  }

  @Delete()
  deleteAccount(@CurrentUser() user: AuthUser) {
    return this.me.deleteAccount(user.id);
  }
}
