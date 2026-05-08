import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUser, createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.getOrThrow<string>('SUPABASE_URL');
    const key = config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');

    this.client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  async getUser(accessToken: string): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser(accessToken);

    if (error) {
      return null;
    }

    return data.user;
  }

  async deleteUser(userId: string) {
    const { error } = await this.client.auth.admin.deleteUser(userId);

    if (error) {
      throw error;
    }
  }
}
