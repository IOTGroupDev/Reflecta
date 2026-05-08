import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
export const avatarBucket = process.env.EXPO_PUBLIC_SUPABASE_AVATAR_BUCKET ?? 'avatars';
export const chatAttachmentBucket =
  process.env.EXPO_PUBLIC_SUPABASE_CHAT_ATTACHMENTS_BUCKET ?? 'chat-attachments';
export const yandexOAuthProvider =
  process.env.EXPO_PUBLIC_YANDEX_OAUTH_PROVIDER ?? 'custom:yandex';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const memoryStorage = new Map<string, string>();
let nativeStorageUnavailable = false;

const safeSessionStorage = {
  getItem: async (key: string) => {
    if (nativeStorageUnavailable) {
      return memoryStorage.get(key) ?? null;
    }

    try {
      return await AsyncStorage.getItem(key);
    } catch {
      nativeStorageUnavailable = true;
      return memoryStorage.get(key) ?? null;
    }
  },
  setItem: async (key: string, value: string) => {
    memoryStorage.set(key, value);

    if (nativeStorageUnavailable) {
      return;
    }

    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      nativeStorageUnavailable = true;
    }
  },
  removeItem: async (key: string) => {
    memoryStorage.delete(key);

    if (nativeStorageUnavailable) {
      return;
    }

    try {
      await AsyncStorage.removeItem(key);
    } catch {
      nativeStorageUnavailable = true;
    }
  },
};

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          ...(Platform.OS !== 'web' ? { storage: safeSessionStorage } : {}),
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          lock: processLock,
        },
      })
    : null;

if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
