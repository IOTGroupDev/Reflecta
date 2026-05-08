import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_OPTIONS = 'reflecta:rate-limit-options';

export type RateLimitOptions = {
  limit: number;
  windowSeconds: number;
  name: string;
};

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_OPTIONS, options);
