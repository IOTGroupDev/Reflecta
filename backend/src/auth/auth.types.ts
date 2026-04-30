import { AuthUser } from '@supabase/supabase-js';

export interface AuthenticatedRequest {
  user: AuthUser;
}
