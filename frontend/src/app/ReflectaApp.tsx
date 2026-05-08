import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Share, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createApiFetch } from '../api/reflectaApi';
import { BottomNav } from '../components/BottomNav';
import { PrivacyLockGate } from '../components/PrivacyLockGate';
import { useChat } from '../hooks/useChat';
import { useDailyReminder } from '../hooks/useDailyReminder';
import { useJournalSync } from '../hooks/useJournalSync';
import { useOnboarding } from '../hooks/useOnboarding';
import { usePrivacyLock } from '../hooks/usePrivacyLock';
import { useReflectaFlow } from '../hooks/useReflectaFlow';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { styles } from '../theme/styles';
import { AppOverlays } from './AppOverlays';
import { AppRoutes } from './AppRoutes';
import { copy } from '../i18n';
import { avatarBucket, supabase } from '../lib/supabase';
import type { Language } from '../types';

const languageKey = 'reflecta:language';

export function ReflectaApp() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('ru');
  const [safetyOpen, setSafetyOpen] = useState(false);
  const timezoneSyncUserId = useRef<string | null>(null);
  const t = copy[language];
  const auth = useSupabaseAuth(language);
  const onboarding = useOnboarding();
  const privacyLock = usePrivacyLock(Boolean(auth.session));
  const apiFetch = useMemo(
    () => createApiFetch(auth.session?.access_token),
    [auth.session?.access_token],
  );
  const hasAuthSession = Boolean(auth.session?.access_token);
  const profile = useUserProfile({ apiFetch, enabled: hasAuthSession });
  const journal = useJournalSync({ apiFetch, enabled: hasAuthSession, language });
  const flow = useReflectaFlow({
    addJournalEntry: journal.addEntry,
    apiFetch,
    hasAuthSession,
    language,
    refreshJournal: journal.refreshJournal,
    refreshSummary: journal.refreshSummary,
  });
  const chat = useChat({
    apiFetch,
    enabled: hasAuthSession,
    language,
    onCrisis: () => setSafetyOpen(true),
  });
  const serverOnboardingGoal = profile.profile?.profile?.onboardingGoal;
  const onboardingComplete = onboarding.completed || Boolean(serverOnboardingGoal);
  const showNavigation = onboardingComplete && Boolean(auth.session);
  const statusBarStyle = showNavigation ? 'dark' : 'light';

  useEffect(() => {
    void AsyncStorage.getItem(languageKey).then((storedLanguage) => {
      if (storedLanguage === 'ru' || storedLanguage === 'en' || storedLanguage === 'es') {
        setLanguage(storedLanguage);
      }
    });
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    void AsyncStorage.setItem(languageKey, nextLanguage).catch(() => undefined);
  };

  useDailyReminder({
    enabled: Boolean(profile.profile?.profile?.dailyReminderEnabled),
    language,
    time: profile.profile?.profile?.dailyReminderTime ?? null,
  });

  useEffect(() => {
    if (!serverOnboardingGoal || onboarding.completed) {
      return;
    }

    void onboarding.restore(serverOnboardingGoal);
  }, [serverOnboardingGoal, onboarding.completed]);

  useEffect(() => {
    if (!hasAuthSession || !onboarding.completed || serverOnboardingGoal) {
      return;
    }

    void profile.savePreferences({
      onboardingGoal: onboarding.goal,
      privacyAccepted: true,
    }).catch(() => undefined);
  }, [hasAuthSession, onboarding.completed, onboarding.goal, serverOnboardingGoal]);

  useEffect(() => {
    const userId = profile.profile?.id;

    if (
      !hasAuthSession ||
      !profile.ready ||
      !userId ||
      profile.profile?.profile?.timezone ||
      timezoneSyncUserId.current === userId
    ) {
      return;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timezone) {
      return;
    }

    timezoneSyncUserId.current = userId;
    void profile.savePreferences({ timezone }).catch(() => {
      timezoneSyncUserId.current = null;
    });
  }, [hasAuthSession, profile.profile?.id, profile.profile?.profile?.timezone, profile.ready]);

  const signOut = async () => {
    await auth.signOut();
    await onboarding.reset();
    setAccountOpen(false);
    profile.clear();
    journal.clear();
    chat.reset();
  };

  const deleteAccount = () => {
    Alert.alert(
      t.alerts.deleteAccountTitle,
      t.alerts.deleteAccountBody,
      [
        { text: t.alerts.cancel, style: 'cancel' },
        {
          text: t.alerts.delete,
          style: 'destructive',
          onPress: () => {
            void profile.deleteAccount()
              .then(() => signOut())
              .catch(() => {
                Alert.alert(t.alerts.deleteFailed);
              });
          },
        },
      ],
    );
  };

  const deleteData = () => {
    Alert.alert(
      t.alerts.clearDataTitle,
      t.alerts.clearDataBody,
      [
        { text: t.alerts.cancel, style: 'cancel' },
        {
          text: t.alerts.clear,
          style: 'destructive',
          onPress: () => {
            void profile.deleteData()
              .then(() => {
                journal.clear();
                chat.reset();
                Alert.alert(t.alerts.done, t.alerts.dataCleared);
              })
              .catch(() => {
                Alert.alert(t.alerts.clearFailed);
              });
          },
        },
      ],
    );
  };

  const exportData = () => {
    void profile.exportData()
      .then((data) => {
        if (!data) {
          Alert.alert(t.alerts.exportFailed, t.alerts.sessionNotReady);
          return;
        }

        return Share.share({
          title: 'Reflecta data export',
          message: JSON.stringify(data, null, 2),
        });
      })
      .catch(() => {
        Alert.alert(t.alerts.exportFailed);
      });
  };

  const exportMarkdown = () => {
    void profile.exportMarkdown()
      .then((data) => {
        if (!data) {
          Alert.alert(t.alerts.exportFailed, t.alerts.sessionNotReady);
          return;
        }

        return Share.share({
          title: 'Reflecta Markdown export',
          message: data.markdown,
        });
      })
      .catch(() => {
        Alert.alert(t.alerts.exportFailed);
      });
  };

  const toggleReminder = () => {
    const enabled = Boolean(profile.profile?.profile?.dailyReminderEnabled);

    void profile.savePreferences({
      dailyReminderEnabled: !enabled,
      dailyReminderTime: profile.profile?.profile?.dailyReminderTime ?? '20:30',
    }).catch(() => {
      Alert.alert(t.alerts.saveFailed);
    });
  };

  const setReminderTime = (time: string) => {
    void profile.savePreferences({
      dailyReminderEnabled: true,
      dailyReminderTime: time,
    }).catch(() => {
      Alert.alert(t.alerts.saveFailed);
    });
  };

  const setProfileFocus = (goal: typeof onboarding.goal) => {
    void profile.savePreferences({
      onboardingGoal: goal,
      privacyAccepted: true,
    }).catch(() => {
      Alert.alert(t.alerts.saveFailed);
    });
  };

  const saveIdentity = (data: { name: string; timezone: string }) => {
    void Promise.all([
      profile.saveProfile({ name: data.name }),
      profile.savePreferences({ timezone: data.timezone }),
    ])
      .then(() => {
        Alert.alert(t.alerts.saved);
      })
      .catch(() => {
        Alert.alert(t.alerts.saveFailed);
      });
  };

  const uploadAvatar = () => {
    void pickAndUploadAvatar()
      .then((avatarUrl) => {
        if (!avatarUrl) {
          return;
        }

        return profile.saveProfile({ avatarUrl });
      })
      .then(() => {
        if (profile.profile) {
          Alert.alert(t.alerts.saved);
        }
      })
      .catch(() => {
        Alert.alert(t.alerts.saveFailed);
      });
  };

  const enablePrivacyPin = (pin: string) => {
    void privacyLock.enablePin(pin)
      .then((enabled) => {
        Alert.alert(enabled ? t.privacyLock.enabled : t.privacyLock.invalidPin);
      })
      .catch(() => {
        Alert.alert(t.alerts.saveFailed);
      });
  };

  const disablePrivacyPin = () => {
    void privacyLock.disablePin()
      .then(() => {
        Alert.alert(t.privacyLock.disabled);
      })
      .catch(() => {
        Alert.alert(t.alerts.saveFailed);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={statusBarStyle} />
      <View style={styles.app}>
        {showNavigation && (
          <AppRoutes
            chat={chat}
            flow={flow}
            journal={journal}
            language={language}
            onDeleteAccount={deleteAccount}
            onDeleteData={deleteData}
            onExportData={exportData}
            onExportMarkdown={exportMarkdown}
            onLanguage={changeLanguage}
            onOpenAccount={() => flow.setActiveTab('profile')}
            onOpenSafety={() => setSafetyOpen(true)}
            onPrivacyPinDisable={disablePrivacyPin}
            onPrivacyPinEnable={enablePrivacyPin}
            onProfileFocus={setProfileFocus}
            onProfileAvatar={uploadAvatar}
            onSaveIdentity={saveIdentity}
            onSetReminderTime={setReminderTime}
            onSignOut={signOut}
            onToggleReminder={toggleReminder}
            privacyPinEnabled={privacyLock.pinEnabled}
            profile={profile.profile}
            starterGoalLabel={t.onboarding.goals[onboarding.goal].label}
            starterScenarioId={onboarding.scenarioId}
            userEmail={auth.session?.user.email ?? null}
            userName={profile.profile?.name ?? null}
            userAvatarUrl={profile.profile?.avatarUrl ?? null}
          />
        )}
        <AppOverlays
          accountOpen={accountOpen}
          auth={auth}
          language={language}
          onCloseAccount={() => setAccountOpen(false)}
          onCloseSafety={() => setSafetyOpen(false)}
          onDeleteAccount={deleteAccount}
          onDeleteData={deleteData}
          onExportData={exportData}
          onExportMarkdown={exportMarkdown}
          onLanguage={changeLanguage}
          onSetReminderTime={setReminderTime}
          onToggleReminder={toggleReminder}
          onSignOut={signOut}
          onboarding={onboarding}
          profile={profile}
          safetyOpen={safetyOpen}
        />
        {showNavigation && (
          <BottomNav activeTab={flow.activeTab} language={language} onChange={flow.setActiveTab} onHome={flow.reset} />
        )}
        {privacyLock.ready && privacyLock.locked && (
          <PrivacyLockGate
            biometricAvailable={privacyLock.biometricAvailable}
            language={language}
            onBiometricUnlock={privacyLock.unlockWithBiometrics}
            onUnlock={privacyLock.unlock}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

async function pickAndUploadAvatar() {
  if (!supabase) {
    throw new Error('Supabase is not configured');
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: ['images'],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    throw new Error('Auth session is not ready');
  }

  const asset = result.assets[0];
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const extension = getAvatarExtension(asset.fileName, asset.mimeType);
  const path = `${userId}/avatar.${extension}`;
  const upload = await supabase.storage.from(avatarBucket).upload(path, blob, {
    contentType: asset.mimeType ?? `image/${extension}`,
    upsert: true,
  });

  if (upload.error) {
    throw upload.error;
  }

  const publicUrl = supabase.storage.from(avatarBucket).getPublicUrl(path);

  return `${publicUrl.data.publicUrl}?v=${Date.now()}`;
}

function getAvatarExtension(fileName?: string | null, mimeType?: string | null) {
  const fileExtension = fileName?.split('.').pop()?.toLowerCase();

  if (fileExtension === 'png' || fileExtension === 'webp' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
    return fileExtension === 'jpeg' ? 'jpg' : fileExtension;
  }

  if (mimeType?.includes('png')) {
    return 'png';
  }

  if (mimeType?.includes('webp')) {
    return 'webp';
  }

  return 'jpg';
}
