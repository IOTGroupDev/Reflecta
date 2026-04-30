import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUser } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthenticatedRequest } from './auth.types';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<
      AuthenticatedRequest & { headers: Record<string, string | undefined> }
    >();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const user = await this.supabase.getUser(token);

    if (!user) {
      throw new UnauthorizedException('Invalid bearer token');
    }

    await this.ensureAppUser(user);
    request.user = user;

    return true;
  }

  private extractBearerToken(header?: string) {
    const [type, token] = header?.split(' ') ?? [];
    return type?.toLowerCase() === 'bearer' ? token : undefined;
  }

  private async ensureAppUser(user: AuthUser) {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
      },
      create: {
        id: user.id,
        email: user.email,
      },
    });
  }
}
