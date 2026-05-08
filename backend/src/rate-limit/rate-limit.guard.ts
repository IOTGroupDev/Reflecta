import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../redis/redis.service';
import { AuthenticatedRequest } from '../auth/auth.types';
import { RATE_LIMIT_OPTIONS, RateLimitOptions } from './rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(
      RATE_LIMIT_OPTIONS,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RateLimitedRequest>();
    const subject = request.user?.id
      ? `user:${request.user.id}`
      : `ip:${this.getClientIp(request)}`;
    const key = `rate:${options.name}:${subject}`;

    let count: number;

    try {
      count = await this.incrementWindow(key, options.windowSeconds);
    } catch {
      throw new ServiceUnavailableException('Rate limiter unavailable');
    }

    if (count > options.limit) {
      throw new HttpException(
        'Too many requests. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private async incrementWindow(key: string, windowSeconds: number) {
    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, windowSeconds);
    }

    return count;
  }

  private getClientIp(request: RateLimitedRequest) {
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip ?? request.socket?.remoteAddress ?? 'unknown';
  }
}

type RateLimitedRequest = AuthenticatedRequest & {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
};
