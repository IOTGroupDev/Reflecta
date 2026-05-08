import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SecondaryButton } from './ui/ActionButton';
import { copy, languages } from '../i18n';
import type { Language, MeProfile } from '../types';

export function AccountSheet({
  email,
  language,
  onClose,
  onDeleteAccount,
  onDeleteData,
  onExportData,
  onExportMarkdown,
  onLanguage,
  onSetReminderTime,
  onToggleReminder,
  onSignOut,
  profile,
}: {
  email: string;
  language: Language;
  onClose: () => void;
  onDeleteAccount: () => void;
  onDeleteData: () => void;
  onExportData: () => void;
  onExportMarkdown: () => void;
  onLanguage: (language: Language) => void;
  onSetReminderTime: (time: string) => void;
  onToggleReminder: () => void;
  onSignOut: () => void;
  profile: MeProfile | null;
}) {
  const t = copy[language];
  const goal = profile?.profile?.onboardingGoal;
  const reminderEnabled = Boolean(profile?.profile?.dailyReminderEnabled);
  const reminderTime = profile?.profile?.dailyReminderTime ?? '20:30';

  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.accountSheet}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sheetHandle} />
          <Text style={styles.panelTitle}>{t.account.title}</Text>
          <Text style={styles.panelText}>{email}</Text>
          <View style={styles.accountNote}>
            <Text style={styles.accountNoteText}>
              {t.account.note}
            </Text>
          </View>
          <View style={styles.privacyPanel}>
            <Text style={styles.privacyTitle}>{t.account.data}</Text>
            <Text style={styles.privacyText}>
              {t.account.goal}: {goal ? t.onboarding.goals[goal].label : t.account.noGoal}
            </Text>
            <Text style={styles.privacyText}>
              {t.account.records(
                profile?.counts.sessions ?? 0,
                profile?.counts.moods ?? 0,
                profile?.counts.chats ?? 0,
              )}
            </Text>
          </View>
          <View style={styles.languageRow}>
            {languages.map((item) => {
              const active = language === item.id;

              return (
                <Pressable
                  key={item.id}
                  style={[styles.languageChip, active && styles.languageChipActive]}
                  onPress={() => onLanguage(item.id)}
                >
                  <Text style={[styles.languageChipText, active && styles.languageChipTextActive]}>
                    {item.short}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.reminderPanel}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>{t.account.rhythm}</Text>
              <Text style={styles.reminderText}>
                {reminderEnabled
                  ? t.account.reminderOn(reminderTime)
                  : t.account.reminderOff}
              </Text>
            </View>
            <Pressable
              style={[styles.reminderToggle, reminderEnabled && styles.reminderToggleActive]}
              onPress={onToggleReminder}
            >
              <Text
                style={[
                  styles.reminderToggleText,
                  reminderEnabled && styles.reminderToggleTextActive,
              ]}
              >
                {reminderEnabled ? t.account.on : t.account.off}
              </Text>
            </Pressable>
          </View>
          <View style={styles.timeRow}>
            {reminderTimes.map((time) => {
              const active = reminderTime === time;

              return (
                <Pressable
                  key={time}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                  onPress={() => onSetReminderTime(time)}
                >
                  <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <SecondaryButton wide label={t.account.close} onPress={onClose} />
          <Pressable style={styles.exportButton} onPress={onExportData}>
            <Text style={styles.exportButtonText}>{t.account.exportData}</Text>
          </Pressable>
          <Pressable style={styles.exportButton} onPress={onExportMarkdown}>
            <Text style={styles.exportButtonText}>{t.account.exportMarkdown}</Text>
          </Pressable>
          <Pressable style={styles.clearButton} onPress={onDeleteData}>
            <Text style={styles.clearButtonText}>{t.account.clearData}</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={onSignOut}>
            <Text style={styles.dangerButtonText}>{t.account.signOut}</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={onDeleteAccount}>
            <Text style={styles.deleteButtonText}>{t.account.deleteAccount}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const reminderTimes = ['09:00', '13:00', '20:30', '22:30'];

const styles = StyleSheet.create({
  sheetOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 30,
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(23,35,58,0.24)',
    flex: 1,
  },
  accountSheet: {
    backgroundColor: '#f7fbff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    bottom: 0,
    left: 0,
    maxHeight: '92%',
    position: 'absolute',
    right: 0,
  },
  sheetContent: {
    padding: 22,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: '#c8d7ea',
    borderRadius: 3,
    height: 5,
    marginBottom: 18,
    width: 46,
  },
  panelTitle: {
    color: '#17233a',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  panelText: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  accountNote: {
    backgroundColor: '#edf5ff',
    borderRadius: 20,
    marginTop: 16,
    padding: 14,
  },
  accountNoteText: {
    color: '#52627a',
    fontSize: 14,
    lineHeight: 20,
  },
  privacyPanel: {
    backgroundColor: '#f7fbff',
    borderColor: '#d7e5f6',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
    padding: 14,
  },
  privacyTitle: {
    color: '#17233a',
    fontSize: 15,
    fontWeight: '900',
  },
  privacyText: {
    color: '#52627a',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  languageChip: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  languageChipActive: {
    backgroundColor: '#17233a',
  },
  languageChipText: {
    color: '#52627a',
    fontSize: 13,
    fontWeight: '900',
  },
  languageChipTextActive: {
    color: '#ffffff',
  },
  reminderPanel: {
    alignItems: 'center',
    backgroundColor: '#17233a',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 14,
  },
  reminderCopy: {
    flex: 1,
  },
  reminderTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  reminderText: {
    color: '#cfe1ff',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  reminderToggle: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 13,
  },
  reminderToggleActive: {
    backgroundColor: '#d7ff7a',
  },
  reminderToggleText: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '900',
  },
  reminderToggleTextActive: {
    color: '#111827',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  timeChip: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  timeChipActive: {
    backgroundColor: '#1976ee',
  },
  timeChipText: {
    color: '#52627a',
    fontSize: 13,
    fontWeight: '900',
  },
  timeChipTextActive: {
    color: '#ffffff',
  },
  exportButton: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },
  exportButtonText: {
    color: '#1976ee',
    fontSize: 15,
    fontWeight: '900',
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#fff2ed',
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },
  clearButtonText: {
    color: '#9f3d21',
    fontSize: 15,
    fontWeight: '900',
  },
  dangerButton: {
    alignItems: 'center',
    borderColor: '#ff9b72',
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },
  dangerButtonText: {
    color: '#d65b36',
    fontSize: 15,
    fontWeight: '800',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 44,
  },
  deleteButtonText: {
    color: '#9f3d21',
    fontSize: 13,
    fontWeight: '900',
  },
});
