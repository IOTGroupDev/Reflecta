import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
export const yandexOAuthProvider =
  process.env.EXPO_PUBLIC_YANDEX_OAUTH_PROVIDER ?? 'custom:yandex';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
