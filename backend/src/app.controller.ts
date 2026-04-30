import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  async health() {
    const [database, redis] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`.then(() => 'ok').catch(() => 'error'),
      this.redis.ping().catch(() => 'error'),
    ]);

    return {
      status: database === 'ok' && redis === 'PONG' ? 'ok' : 'degraded',
      services: {
        database,
        redis: redis === 'PONG' ? 'ok' : redis,
      },
    };
  }
}
