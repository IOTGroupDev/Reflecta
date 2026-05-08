import { Provider, Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { copy } from '../i18n';
import { authRedirectTo } from '../lib/redirect';
import { supabase, yandexOAuthProvider } from '../lib/supabase';
import type { Language } from '../types';

WebBrowser.maybeCompleteAuthSession();

const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_RESEND_WINDOW_MS = 15 * 60 * 1000;
const OTP_RESEND_MAX_ATTEMPTS = 5;

export type AuthController = ReturnType<typeof useSupabaseAuth>;

export function useSupabaseAuth(language: Language = 'ru') {
  const t = copy[language].authMessages;
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [resendAttemptTimestamps, setResendAttemptTimestamps] = useState<number[]>([]);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const ensureSession = async () => {
      if (!supabase) {
        setAuthReady(true);
        return;
      }

      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          await createSessionFromUrl(initialUrl);
        }

        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setSession(data.session);
        }
      } finally {
        setAuthReady(true);
      }
    };

    void ensureSession();

    if (!supabase) {
      return undefined;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);

      if (nextSession) {
        setAuthCode('');
        setAuthCodeSent(false);
        setAuthMessage('');
        setAuthLoading(false);
      }
    });

    const linkSubscription = Linking.addEventListener('url', ({ url }) => {
      void createSessionFromUrl(url).catch(() => {
        setAuthMessage(t.openLinkFailed);
      });
    });

    return () => {
      data.subscription.unsubscribe();
      linkSubscription.remove();
    };
  }, [t.openLinkFailed]);

  useEffect(() => {
    if (!resendAvailableAt) {
      return undefined;
    }

    if (resendAvailableAt <= Date.now()) {
      setResendAvailableAt(null);
      return undefined;
    }

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [resendAvailableAt]);

  const recentResendAttemptTimestamps = resendAttemptTimestamps.filter(
    (timestamp) => now - timestamp < OTP_RESEND_WINDOW_MS,
  );
  const resendWindowBlockedUntil =
    recentResendAttemptTimestamps.length >= OTP_RESEND_MAX_ATTEMPTS
      ? recentResendAttemptTimestamps[0] + OTP_RESEND_WINDOW_MS
      : null;
  const resendLockedUntil = Math.max(
    resendAvailableAt ?? 0,
    resendWindowBlockedUntil ?? 0,
  );
  const resendAvailableInSeconds =
    resendLockedUntil > now
      ? Math.ceil((resendLockedUntil - now) / 1000)
      : 0;

  const requestEmailCode = async () => {
    if (!supabase) {
      setAuthMessage(t.missingEnv);
      return;
    }

    if (!authEmail.trim()) {
      setAuthMessage(t.enterEmail);
      return;
    }

    const currentTime = Date.now();
    const nextRecentResendAttemptTimestamps = resendAttemptTimestamps.filter(
      (timestamp) => currentTime - timestamp < OTP_RESEND_WINDOW_MS,
    );
    const cooldownRemainingSeconds =
      resendAvailableAt && resendAvailableAt > currentTime
        ? Math.ceil((resendAvailableAt - currentTime) / 1000)
        : 0;

    if (cooldownRemainingSeconds > 0) {
      setNow(currentTime);
      setAuthMessage(
        t.resendWait(formatWaitTime(cooldownRemainingSeconds, language)),
      );
      return;
    }

    if (nextRecentResendAttemptTimestamps.length >= OTP_RESEND_MAX_ATTEMPTS) {
      const waitUntil =
        nextRecentResendAttemptTimestamps[0] + OTP_RESEND_WINDOW_MS;
      const waitSeconds = Math.ceil((waitUntil - currentTime) / 1000);

      setResendAvailableAt(waitUntil);
      setNow(currentTime);
      setAuthMessage(
        t.tooManyWait(formatWaitTime(waitSeconds, language)),
      );
      return;
    }

    setAuthLoading(true);
    setAuthMessage('');

    try {
      const sentWithoutRedirect = await sendEmailLink(authEmail.trim());

      setAuthCodeSent(true);
      setAuthCode('');
      setResendAttemptTimestamps([
        ...nextRecentResendAttemptTimestamps,
        currentTime,
      ]);
      setResendAvailableAt(
        currentTime + OTP_RESEND_COOLDOWN_SECONDS * 1000,
      );
      setNow(currentTime);
      setAuthMessage(
        sentWithoutRedirect
          ? t.sentNoRedirect(formatWaitTime(OTP_RESEND_COOLDOWN_SECONDS, language))
          : t.sent(formatWaitTime(OTP_RESEND_COOLDOWN_SECONDS, language)),
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes('email rate limit exceeded')
      ) {
        setAuthCodeSent(true);
        setResendAvailableAt(currentTime + OTP_RESEND_COOLDOWN_SECONDS * 1000);
        setNow(currentTime);
        setAuthMessage(
          t.tooManyWait(formatWaitTime(OTP_RESEND_COOLDOWN_SECONDS, language)),
        );
      } else {
        setAuthMessage(getEmailErrorMessage(error, language));
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!supabase) {
      setAuthMessage(t.missingEnv);
      return;
    }

    if (!authEmail.trim() || authCode.trim().length < 4) {
      setAuthMessage(t.enterCode);
      return;
    }

    setAuthLoading(true);
    setAuthMessage('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: authEmail.trim(),
        token: authCode.trim(),
        type: 'email',
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
        setAuthCode('');
        setAuthCodeSent(false);
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : t.codeFailed);
    } finally {
      setAuthLoading(false);
    }
  };

  const submitAuth = () => {
    if (authCodeSent) {
      void verifyEmailCode();
      return;
    }

    void requestEmailCode();
  };

  const signInWithOAuth = async (provider: Provider | 'yandex') => {
    if (!supabase) {
      setAuthMessage(t.missingEnv);
      return;
    }

    const providerName = provider === 'yandex' ? yandexOAuthProvider : provider;
    setAuthLoading(true);
    setAuthMessage('');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: providerName as Provider,
      options: {
        redirectTo: authRedirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      setAuthMessage(error.message);
      setAuthLoading(false);
      return;
    }

    if (!data.url) {
      setAuthLoading(false);
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectTo);

    if (result.type === 'success') {
      await createSessionFromUrl(result.url);
      setAuthLoading(false);
      return;
    }

    setAuthLoading(false);
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSession(null);
  };

  return {
    authCode,
    authCodeSent,
    authEmail,
    authLoading,
    authMessage,
    authReady,
    requestEmailCode,
    resendAvailableInSeconds,
    session,
    setAuthCode,
    setAuthEmail,
    signInWithOAuth,
    signOut,
    submitAuth,
  };
}

async function sendEmailLink(email: string) {
  if (!supabase) {
    throw new Error('Supabase env не настроен для фронта.');
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: authRedirectTo,
      shouldCreateUser: true,
    },
  });

  if (!error) {
    return false;
  }

  if (!shouldRetryWithoutRedirect(error)) {
    throw error;
  }

  const fallback = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (fallback.error) {
    throw fallback.error;
  }

  return true;
}

function shouldRetryWithoutRedirect(error: Error) {
  const message = error.message.toLowerCase();

  return (
    message.includes('redirect') ||
    message.includes('email redirect') ||
    message.includes('not allowed')
  );
}

function getEmailErrorMessage(error: unknown, language: Language) {
  const t = copy[language].authMessages;

  if (!(error instanceof Error)) {
    return t.sendFailed;
  }

  const message = error.message.toLowerCase();

  if (message.includes('rate limit') || message.includes('too many')) {
    return t.tooMany;
  }

  if (message.includes('invalid') && message.includes('email')) {
    return t.invalidEmail;
  }

  return t.sendFailedWithMessage(error.message);
}

async function createSessionFromUrl(url: string) {
  if (!supabase) {
    return;
  }

  const params = getUrlParams(url);
  const code = params.code;
  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    return;
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw error;
    }
  }
}

function getUrlParams(url: string) {
  const [, queryString = ''] = url.split('?');
  const [query, queryFragment = ''] = queryString.split('#');
  const [, urlFragment = ''] = url.split('#');
  const fragment = queryFragment || urlFragment;
  const params = new URLSearchParams(query);
  const fragmentParams = new URLSearchParams(fragment);

  fragmentParams.forEach((value, key) => {
    params.set(key, value);
  });

  return Object.fromEntries(params.entries());
}

function formatWaitTime(totalSeconds: number, language: Language) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return copy[language].authMessages.seconds(seconds);
  }

  return copy[language].authMessages.minutes(minutes, seconds);
}
