import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { JournalModule } from './journal/journal.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '../.env'],
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    SupabaseModule,
    AuthModule,
    AiModule,
    ChatModule,
    JournalModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
