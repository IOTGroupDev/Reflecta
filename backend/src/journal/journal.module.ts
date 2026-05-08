import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [AiModule, RateLimitModule],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
