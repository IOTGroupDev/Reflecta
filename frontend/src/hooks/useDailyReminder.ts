import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { copy } from '../i18n';
import type { Language } from '../types';

const reminderIdentifier = 'reflecta-daily-reminder';
const reminderChannelId = 'reflecta-daily';
const fallbackTime = { hour: 20, minute: 30 };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useDailyReminder({
  enabled,
  language,
  time,
}: {
  enabled: boolean;
  language: Language;
  time: string | null;
}) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    if (!enabled) {
      void cancelDailyReminder().catch(() => undefined);
      return;
    }

    void scheduleDailyReminder(time ?? '20:30', language).catch(() => undefined);
  }, [enabled, language, time]);
}

async function scheduleDailyReminder(time: string, language: Language) {
  const { hour, minute } = parseReminderTime(time);
  const permissions = await Notifications.getPermissionsAsync();
  const finalPermissions = permissions.granted
    ? permissions
    : await Notifications.requestPermissionsAsync();

  if (!finalPermissions.granted) {
    return;
  }

  await cancelDailyReminder();
  await ensureAndroidChannel();

  await Notifications.scheduleNotificationAsync({
    identifier: reminderIdentifier,
    content: {
      title: 'Reflecta',
      body: copy[language].notification.body,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: reminderChannelId,
      hour,
      minute,
    },
  });
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(reminderChannelId, {
    name: 'Reflecta Daily',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
    enableVibrate: false,
    showBadge: false,
  });
}

function parseReminderTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);

  if (
    Number.isInteger(hour) &&
    Number.isInteger(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  ) {
    return { hour, minute };
  }

  return fallbackTime;
}

async function cancelDailyReminder() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const reminder = scheduled.find((item) => item.identifier === reminderIdentifier);

  if (reminder) {
    await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
  }
}
