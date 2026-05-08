import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '../components/ui/ActionButton';
import { copy, languages } from '../i18n';
import type { Language, MeProfile, OnboardingGoal } from '../types';

const reminderTimes = ['09:00', '13:00', '20:30', '22:30'];
const goals: OnboardingGoal[] = ['calm', 'sleep', 'burnout', 'journal'];

export function ProfileScreen({
  email,
  language,
  onDeleteAccount,
  onDeleteData,
  onExportData,
  onExportMarkdown,
  onFocus,
  onLanguage,
  onPrivacyPinDisable,
  onPrivacyPinEnable,
  onProfileAvatar,
  onSaveIdentity,
  onSetReminderTime,
  onSignOut,
  onToggleReminder,
  privacyPinEnabled,
  profile,
}: {
  email: string | null;
  language: Language;
  onDeleteAccount: () => void;
  onDeleteData: () => void;
  onExportData: () => void;
  onExportMarkdown: () => void;
  onFocus: (goal: OnboardingGoal) => void;
  onLanguage: (language: Language) => void;
  onPrivacyPinDisable: () => void;
  onPrivacyPinEnable: (pin: string) => void;
  onProfileAvatar: () => void;
  onSaveIdentity: (data: { name: string; timezone: string }) => void;
  onSetReminderTime: (time: string) => void;
  onSignOut: () => void;
  onToggleReminder: () => void;
  privacyPinEnabled: boolean;
  profile: MeProfile | null;
}) {
  const t = copy[language];
  const goal = profile?.profile?.onboardingGoal;
  const reminderEnabled = Boolean(profile?.profile?.dailyReminderEnabled);
  const reminderTime = profile?.profile?.dailyReminderTime ?? '20:30';
  const counts = profile?.counts ?? { sessions: 0, moods: 0, chats: 0 };
  const avatarLetter = email?.trim().charAt(0).toUpperCase() ?? 'R';
  const [name, setName] = useState(profile?.name ?? '');
  const [privacyPin, setPrivacyPin] = useState('');
  const [timezone, setTimezone] = useState(profile?.profile?.timezone ?? '');

  useEffect(() => {
    setName(profile?.name ?? '');
    setTimezone(profile?.profile?.timezone ?? '');
  }, [profile?.name, profile?.profile?.timezone]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>{t.profile.signedIn}</Text>
          <Text style={styles.title}>{t.profile.title}</Text>
          <Text style={styles.email} numberOfLines={1}>{email ?? 'Supabase user'}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>{t.profile.subtitle}</Text>

      <View style={styles.identityPanel}>
        <Text style={styles.inputLabel}>{t.profile.displayName}</Text>
        <Pressable style={styles.avatarButton} onPress={onProfileAvatar}>
          <Text style={styles.avatarButtonText}>{t.profile.uploadAvatar}</Text>
        </Pressable>
        <TextInput
          autoCapitalize="words"
          maxLength={80}
          onChangeText={setName}
          placeholder={t.profile.displayNamePlaceholder}
          placeholderTextColor="#9aabc2"
          style={styles.input}
          value={name}
        />
        <Text style={styles.inputLabel}>{t.profile.timezone}</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={80}
          onChangeText={setTimezone}
          placeholder={t.profile.timezonePlaceholder}
          placeholderTextColor="#9aabc2"
          style={styles.input}
          value={timezone}
        />
        <PrimaryButton
          label={t.profile.saveIdentity}
          onPress={() => onSaveIdentity({ name, timezone })}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.profile.focus}</Text>
          <Text style={styles.sectionHint}>{t.profile.chooseFocus}</Text>
        </View>
        <View style={styles.goalGrid}>
          {goals.map((item) => {
            const active = goal === item;

            return (
              <Pressable
                key={item}
                style={[styles.goalChip, active && styles.goalChipActive]}
                onPress={() => onFocus(item)}
              >
                <Text style={[styles.goalTitle, active && styles.goalTitleActive]}>
                  {t.onboarding.goals[item].title}
                </Text>
                <Text style={[styles.goalText, active && styles.goalTextActive]} numberOfLines={1}>
                  {t.onboarding.goals[item].label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.statsPanel}>
        <Text style={styles.sectionTitle}>{t.profile.stats}</Text>
        <View style={styles.statsRow}>
          <Stat value={counts.sessions} label={t.profile.sessions} />
          <Stat value={counts.moods} label={t.profile.moods} />
          <Stat value={counts.chats} label={t.profile.chats} />
        </View>
      </View>

      <View style={styles.reminderPanel}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderCopy}>
            <Text style={styles.reminderTitle}>{t.profile.reminder}</Text>
            <Text style={styles.reminderText}>
              {reminderEnabled
                ? t.profile.reminderHintOn(reminderTime)
                : t.profile.reminderHintOff}
            </Text>
          </View>
          <Pressable
            style={[styles.toggle, reminderEnabled && styles.toggleActive]}
            onPress={onToggleReminder}
          >
            <Text style={[styles.toggleText, reminderEnabled && styles.toggleTextActive]}>
              {reminderEnabled ? t.account.on : t.account.off}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.controlLabel}>{t.profile.reminderTime}</Text>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.profile.language}</Text>
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
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.privacyPanel}>
        <Text style={styles.sectionTitle}>{t.profile.privacy}</Text>
        <Text style={styles.privacyText}>{t.profile.privacyText}</Text>
        <View style={styles.lockPanel}>
          <Text style={styles.lockTitle}>{t.profile.privacyLock}</Text>
          <Text style={styles.privacyText}>{t.profile.privacyLockText}</Text>
          {privacyPinEnabled ? (
            <Pressable style={styles.clearButton} onPress={onPrivacyPinDisable}>
              <Text style={styles.clearButtonText}>{t.profile.disablePrivacyLock}</Text>
            </Pressable>
          ) : (
            <>
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setPrivacyPin}
                placeholder={t.profile.privacyLockPlaceholder}
                placeholderTextColor="#9aabc2"
                secureTextEntry
                style={styles.input}
                value={privacyPin}
              />
              <PrimaryButton
                label={t.profile.enablePrivacyLock}
                onPress={() => {
                  onPrivacyPinEnable(privacyPin);
                  setPrivacyPin('');
                }}
              />
            </>
          )}
        </View>
        <SecondaryButton wide label={t.account.exportData} onPress={onExportData} />
        <SecondaryButton wide label={t.account.exportMarkdown} onPress={onExportMarkdown} />
        <Pressable style={styles.clearButton} onPress={onDeleteData}>
          <Text style={styles.clearButtonText}>{t.account.clearData}</Text>
        </Pressable>
        <Pressable style={styles.signOutButton} onPress={onSignOut}>
          <Text style={styles.signOutButtonText}>{t.account.signOut}</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={onDeleteAccount}>
          <Text style={styles.deleteButtonText}>{t.account.deleteAccount}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 118,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarImage: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  headerCopy: {
    flex: 1,
  },
  kicker: {
    color: '#5f718f',
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: '#13233b',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
  },
  email: {
    color: '#63728a',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  subtitle: {
    color: '#52627a',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 18,
  },
  identityPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginTop: 22,
    padding: 16,
  },
  inputLabel: {
    color: '#52627a',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  avatarButton: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderRadius: 18,
    justifyContent: 'center',
    marginBottom: 10,
    minHeight: 46,
  },
  avatarButtonText: {
    color: '#1976ee',
    fontSize: 14,
    fontWeight: '900',
  },
  input: {
    backgroundColor: '#f2f7fd',
    borderColor: '#d9e7f7',
    borderRadius: 16,
    borderWidth: 1,
    color: '#17233a',
    fontSize: 16,
    fontWeight: '700',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#17233a',
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionHint: {
    color: '#63728a',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalChip: {
    backgroundColor: '#edf5ff',
    borderColor: '#d9e7f7',
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 72,
    padding: 12,
    width: '48%',
  },
  goalChipActive: {
    backgroundColor: '#17233a',
    borderColor: '#17233a',
  },
  goalTitle: {
    color: '#17233a',
    fontSize: 15,
    fontWeight: '900',
  },
  goalTitleActive: {
    color: '#ffffff',
  },
  goalText: {
    color: '#63728a',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  goalTextActive: {
    color: '#cfe1ff',
  },
  statsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginTop: 24,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  stat: {
    backgroundColor: '#f2f7fd',
    borderRadius: 16,
    flex: 1,
    minHeight: 78,
    padding: 12,
  },
  statValue: {
    color: '#1976ee',
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: '#52627a',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  reminderPanel: {
    backgroundColor: '#17233a',
    borderRadius: 22,
    marginTop: 14,
    padding: 16,
  },
  reminderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  reminderCopy: {
    flex: 1,
  },
  reminderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  reminderText: {
    color: '#cfe1ff',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  toggle: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 17,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 58,
    paddingHorizontal: 12,
  },
  toggleActive: {
    backgroundColor: '#d7ff7a',
  },
  toggleText: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '900',
  },
  toggleTextActive: {
    color: '#111827',
  },
  controlLabel: {
    color: '#9fb5d1',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 16,
    textTransform: 'uppercase',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  timeChip: {
    alignItems: 'center',
    backgroundColor: '#253650',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  timeChipActive: {
    backgroundColor: '#1976ee',
  },
  timeChipText: {
    color: '#cfe1ff',
    fontSize: 13,
    fontWeight: '900',
  },
  timeChipTextActive: {
    color: '#ffffff',
  },
  languageRow: {
    gap: 8,
    marginTop: 12,
  },
  languageChip: {
    backgroundColor: '#edf5ff',
    borderRadius: 18,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  languageChipActive: {
    backgroundColor: '#1976ee',
  },
  languageChipText: {
    color: '#52627a',
    fontSize: 15,
    fontWeight: '900',
  },
  languageChipTextActive: {
    color: '#ffffff',
  },
  privacyPanel: {
    marginTop: 24,
  },
  lockPanel: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    marginBottom: 14,
    marginTop: 14,
    padding: 14,
  },
  lockTitle: {
    color: '#17233a',
    fontSize: 16,
    fontWeight: '900',
  },
  privacyText: {
    color: '#52627a',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
    marginTop: 8,
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
  signOutButton: {
    alignItems: 'center',
    borderColor: '#d7e5f6',
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 52,
  },
  signOutButtonText: {
    color: '#17233a',
    fontSize: 15,
    fontWeight: '900',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 44,
  },
  deleteButtonText: {
    color: '#b42318',
    fontSize: 14,
    fontWeight: '900',
  },
});
