import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { CurrentUser } from '../auth/current-user.decorator';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { RateLimit } from '../rate-limit/rate-limit.decorator';
import { RateLimitGuard } from '../rate-limit/rate-limit.guard';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './chat.types';

@Controller('chat')
@UseGuards(SupabaseAuthGuard, RateLimitGuard)
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get('history')
  history(@CurrentUser() user: AuthUser) {
    return this.chat.history(user.id);
  }

  @Post('message')
  @RateLimit({ name: 'chat-message', limit: 30, windowSeconds: 60 * 60 })
  message(@Body() dto: ChatMessageDto, @CurrentUser() user: AuthUser) {
    return this.chat.reply({ ...dto, userId: user.id });
  }
}
