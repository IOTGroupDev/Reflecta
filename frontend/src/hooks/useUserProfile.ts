import { useEffect, useState } from 'react';
import {
  deleteMyData,
  deleteMe,
  exportMe,
  exportMeMarkdown,
  fetchMe,
  updateMe,
  updatePreferences,
  type ApiFetch,
} from '../api/reflectaApi';
import type { MeProfile, OnboardingGoal } from '../types';

export type UserProfileController = ReturnType<typeof useUserProfile>;

export function useUserProfile({
  apiFetch,
  enabled,
}: {
  apiFetch: ApiFetch;
  enabled: boolean;
}) {
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [ready, setReady] = useState(!enabled);

  const refresh = async () => {
    if (!enabled) {
      setReady(true);
      return;
    }

    setReady(false);

    try {
      const nextProfile = await fetchMe(apiFetch);
      setProfile(nextProfile);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    void refresh();
  }, [enabled, apiFetch]);

  const savePreferences = async (preferences: {
    onboardingGoal?: OnboardingGoal;
    timezone?: string;
    dailyReminderEnabled?: boolean;
    dailyReminderTime?: string;
    privacyAccepted?: boolean;
  }) => {
    if (!enabled) {
      return;
    }

    const response = await updatePreferences(apiFetch, preferences);

    if (!response.ok) {
      throw new Error('Update preferences request failed');
    }

    await refresh();
  };

  const saveProfile = async (data: { avatarUrl?: string | null; name?: string }) => {
    if (!enabled) {
      return;
    }

    const response = await updateMe(apiFetch, data);

    if (!response.ok) {
      throw new Error('Update profile request failed');
    }

    await refresh();
  };

  const deleteAccount = async () => {
    if (!enabled) {
      return;
    }

    const response = await deleteMe(apiFetch);

    if (!response.ok) {
      throw new Error('Delete account request failed');
    }

    setProfile(null);
  };

  const deleteData = async () => {
    if (!enabled) {
      return;
    }

    const response = await deleteMyData(apiFetch);

    if (!response.ok) {
      throw new Error('Delete data request failed');
    }

    await refresh();
  };

  const exportData = async () => {
    if (!enabled) {
      return null;
    }

    return exportMe(apiFetch);
  };

  const exportMarkdown = async () => {
    if (!enabled) {
      return null;
    }

    return exportMeMarkdown(apiFetch);
  };

  const clear = () => {
    setProfile(null);
    setReady(true);
  };

  return {
    clear,
    deleteAccount,
    deleteData,
    exportData,
    exportMarkdown,
    profile,
    ready,
    refresh,
    saveProfile,
    savePreferences,
  };
}
