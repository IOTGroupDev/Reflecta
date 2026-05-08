import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { copy, getScenarios } from '../i18n';
import { getDailyPlan } from '../plans';
import type { JournalEntry, JournalSummary, Language, MoodPeriod, Scenario, ScenarioId } from '../types';

export function HomeScreen({
  lastEntry,
  language,
  onChat,
  onMood,
  onOpenAccount,
  onOpenJournal,
  onPractice,
  onSafety,
  onScenario,
  summary,
  starterGoalLabel,
  starterScenarioId,
  userEmail,
  userAvatarUrl,
  userName,
  todayMood,
}: {
  lastEntry?: JournalEntry;
  language: Language;
  onChat: () => void;
  onMood: (value: number, options?: { note?: string; period?: MoodPeriod }) => void;
  onOpenAccount: () => void;
  onOpenJournal: () => void;
  onPractice: (scenario: Scenario) => void;
  onSafety: () => void;
  onScenario: (scenario: Scenario) => void;
  summary: JournalSummary | null;
  starterGoalLabel?: string;
  starterScenarioId?: ScenarioId;
  userEmail: string | null;
  userAvatarUrl: string | null;
  userName: string | null;
  todayMood: number | null;
}) {
  const t = copy[language];
  const scenarios = getScenarios(language);
  const [moodPeriod, setMoodPeriod] = useState<MoodPeriod>('morning');
  const [moodNote, setMoodNote] = useState('');
  const topScenario = summary?.topScenario
    ? scenarios.find((item) => item.id === summary.topScenario?.id)
    : null;
  const dailyPlan = getDailyPlan(
    summary,
    todayMood,
    lastEntry,
    summary?.moodCount || summary?.sessionCount || todayMood || lastEntry
      ? undefined
      : starterScenarioId,
    starterGoalLabel,
    language,
  );
  const avatarLetter = userEmail?.trim().charAt(0).toUpperCase() ?? 'R';
  const displayName = userName?.trim();
  const ritualStepsDone = Number(Boolean(todayMood)) + Number(Boolean(lastEntry));
  const totalTouches = (summary?.moodCount ?? 0) + (summary?.sessionCount ?? 0);
  const focusLabel = topScenario?.title ?? dailyPlan.scenario.title;
  const rhythmTitle =
    ritualStepsDone === 2
      ? t.home.rhythmClosed
      : ritualStepsDone === 1
        ? t.home.rhythmOneLeft
        : t.home.rhythmOneTouch;
  const rhythmText =
    ritualStepsDone === 2
      ? t.home.rhythmTextDone
      : todayMood
        ? t.home.rhythmTextMood(dailyPlan.scenario.title.toLowerCase())
        : t.home.rhythmTextEmpty;

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.kicker}>{t.home.kicker}</Text>
          <Text style={styles.heroTitle}>
            {displayName ? t.home.titleWithName(displayName) : t.home.title}
          </Text>
        </View>
        <Pressable style={styles.avatar} onPress={onOpenAccount}>
          {userAvatarUrl ? (
            <Image source={{ uri: userAvatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.practicePanel}>
        <View style={styles.softIcon}>
          <Text style={styles.softIconText}>5</Text>
        </View>
        <Text style={styles.panelTitle}>{dailyPlan.title}</Text>
        <Text style={styles.panelText}>{dailyPlan.body}</Text>
        <View style={styles.planMetaRow}>
          <Text style={styles.planMeta}>{dailyPlan.reason}</Text>
          <Text style={styles.planMeta}>{dailyPlan.action}</Text>
        </View>
        <PrimaryButton label={t.home.openPractice} onPress={() => onPractice(dailyPlan.scenario)} />
      </View>

      <Pressable style={styles.talkPanel} onPress={onChat}>
        <View style={styles.talkDot}>
          <Text style={styles.talkDotText}>?</Text>
        </View>
        <View style={styles.talkCopy}>
          <Text style={styles.talkTitle}>{t.home.talkTitle}</Text>
          <Text style={styles.talkText}>{t.home.talkText}</Text>
        </View>
      </Pressable>

      <Pressable style={styles.safetyStrip} onPress={onSafety}>
        <Text style={styles.safetyStripTitle}>{t.home.safetyTitle}</Text>
        <Text style={styles.safetyStripText}>{t.home.safetyText}</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.home.moodTitle}</Text>
        <Text style={styles.sectionHint}>{t.home.moodHint}</Text>
      </View>
      <View style={styles.periodSwitch}>
        {([
          ['morning', t.home.morning],
          ['evening', t.home.evening],
        ] as const).map(([period, label]) => (
          <Pressable
            key={period}
            style={[styles.periodButton, moodPeriod === period && styles.periodButtonActive]}
            onPress={() => setMoodPeriod(period)}
          >
            <Text style={[styles.periodButtonText, moodPeriod === period && styles.periodButtonTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        onChangeText={setMoodNote}
        placeholder={t.home.moodNotePlaceholder}
        placeholderTextColor="#8a97aa"
        style={styles.moodNoteInput}
        value={moodNote}
      />
      <View style={styles.moodRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            style={[styles.moodButton, todayMood === value && styles.moodButtonActive]}
            onPress={() => {
              onMood(value, {
                note: moodNote.trim() || undefined,
                period: moodPeriod,
              });
              setMoodNote('');
            }}
          >
            <Text style={[styles.moodButtonText, todayMood === value && styles.moodButtonTextActive]}>
              {value}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.ritualPanel}>
        <View>
          <Text style={styles.ritualKicker}>{t.home.rhythmKicker}</Text>
          <Text style={styles.ritualTitle}>{t.home.rhythmSteps(ritualStepsDone)}</Text>
          <Text style={styles.ritualText}>
            {ritualStepsDone === 2
              ? t.home.rhythmDone
              : todayMood
                ? t.home.rhythmMoodDone
                : t.home.rhythmStart}
          </Text>
        </View>
        <Pressable style={styles.ritualAction} onPress={() => onPractice(dailyPlan.scenario)}>
          <Text style={styles.ritualActionText}>
            {ritualStepsDone === 2 ? t.home.repeat : t.common.continue}
          </Text>
        </Pressable>
      </View>

      <View style={styles.progressPanel}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.panelTitle}>{t.home.rhythmPanel}</Text>
            <Text style={styles.rhythmSubtitle}>{rhythmTitle}</Text>
          </View>
          <View style={styles.progressLinks}>
            <Pressable onPress={onOpenAccount}>
              <Text style={styles.linkText}>{t.home.time}</Text>
            </Pressable>
            <Pressable onPress={onOpenJournal}>
              <Text style={styles.linkText}>{t.common.journal}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.rhythmTrack}>
          <View style={[styles.rhythmSegment, ritualStepsDone >= 1 && styles.rhythmSegmentDone]} />
          <View style={[styles.rhythmSegment, ritualStepsDone >= 2 && styles.rhythmSegmentDone]} />
        </View>
        <Text style={styles.panelText}>{rhythmText}</Text>
        <View style={styles.progressGrid}>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{ritualStepsDone}/2</Text>
            <Text style={styles.progressLabel}>{t.home.today}</Text>
          </View>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{totalTouches}</Text>
            <Text style={styles.progressLabel}>{t.home.touches}</Text>
          </View>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{focusLabel}</Text>
            <Text style={styles.progressLabel}>{t.home.focus}</Text>
          </View>
        </View>
        <Pressable style={styles.nextRhythmAction} onPress={() => onPractice(dailyPlan.scenario)}>
          <Text style={styles.nextRhythmActionText}>
            {ritualStepsDone === 2 ? t.home.repeatPractice : t.home.nextStep}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.home.quickHelp}</Text>
        <Text style={styles.sectionHint}>{t.home.quickHelpHint}</Text>
      </View>
      <View style={styles.scenarioGrid}>
        {scenarios.map((scenario) => (
          <Pressable
            key={scenario.id}
            style={styles.scenarioTile}
            onPress={() => onScenario(scenario)}
          >
            <ScenarioMark scenario={scenario} />
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            <Text style={styles.scenarioSubtitle}>{scenario.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.memoryPanel}>
        <Text style={styles.panelTitle}>
          {lastEntry ? t.home.lastEntry : t.home.memoryTitle}
        </Text>
        <Text style={styles.panelText}>
          {lastEntry
            ? t.home.lastEntryText(lastEntry.createdAt, lastEntry.scenario.title)
            : t.home.memoryText}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  kicker: {
    color: '#5f718f',
    fontSize: 15,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#13233b',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 2,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#edf5ff',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    boxShadow: '0 10px 18px rgba(117,146,185,0.16)',
    width: 48,
  },
  avatarImage: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  avatarText: {
    color: '#1d73df',
    fontSize: 18,
    fontWeight: '800',
  },
  practicePanel: {
    backgroundColor: 'rgba(247,251,255,0.82)',
    borderRadius: 28,
    padding: 22,
    boxShadow: '0 16px 26px rgba(142,169,201,0.18)',
  },
  softIcon: {
    alignItems: 'center',
    backgroundColor: '#e5f0ff',
    borderRadius: 20,
    height: 42,
    justifyContent: 'center',
    marginBottom: 16,
    width: 42,
  },
  softIconText: {
    color: '#1f76e8',
    fontSize: 18,
    fontWeight: '800',
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
  planMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  planMeta: {
    backgroundColor: '#edf5ff',
    borderRadius: 14,
    color: '#1976ee',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  talkPanel: {
    alignItems: 'center',
    backgroundColor: '#17233a',
    borderRadius: 26,
    flexDirection: 'row',
    marginTop: 14,
    padding: 18,
  },
  talkDot: {
    alignItems: 'center',
    backgroundColor: '#8fc0ff',
    borderRadius: 20,
    height: 42,
    justifyContent: 'center',
    marginRight: 14,
    width: 42,
  },
  talkDotText: {
    color: '#17233a',
    fontSize: 20,
    fontWeight: '900',
  },
  talkCopy: {
    flex: 1,
  },
  talkTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  talkText: {
    color: '#cfe1ff',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  safetyStrip: {
    backgroundColor: '#fff2ed',
    borderColor: '#ffc4ad',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  safetyStripTitle: {
    color: '#9f3d21',
    fontSize: 16,
    fontWeight: '900',
  },
  safetyStripText: {
    color: '#7a584d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 28,
  },
  sectionTitle: {
    color: '#17233a',
    fontSize: 21,
    fontWeight: '800',
  },
  sectionHint: {
    color: '#74839a',
    fontSize: 13,
    fontWeight: '700',
  },
  moodRow: {
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    padding: 12,
  },
  periodSwitch: {
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    padding: 6,
  },
  periodButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    minHeight: 38,
  },
  periodButtonActive: {
    backgroundColor: '#17233a',
  },
  periodButtonText: {
    color: '#63728a',
    fontSize: 13,
    fontWeight: '900',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  moodNoteInput: {
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderColor: 'rgba(99,114,138,0.14)',
    borderRadius: 18,
    borderWidth: 1,
    color: '#17233a',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  moodButton: {
    alignItems: 'center',
    backgroundColor: '#e5edf8',
    borderRadius: 18,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  moodButtonActive: {
    backgroundColor: '#1976ee',
  },
  moodButtonText: {
    color: '#6e7c91',
    fontSize: 18,
    fontWeight: '800',
  },
  moodButtonTextActive: {
    color: '#ffffff',
  },
  ritualPanel: {
    alignItems: 'center',
    backgroundColor: '#17233a',
    borderRadius: 26,
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    padding: 18,
  },
  ritualKicker: {
    color: '#8fc0ff',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  ritualTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  ritualText: {
    color: '#cfe1ff',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  ritualAction: {
    alignItems: 'center',
    backgroundColor: '#d7ff7a',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  ritualActionText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
  },
  progressPanel: {
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 26,
    marginTop: 16,
    padding: 18,
  },
  progressHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rhythmSubtitle: {
    color: '#63728a',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },
  progressLinks: {
    alignItems: 'flex-end',
    gap: 8,
  },
  linkText: {
    color: '#1976ee',
    fontSize: 14,
    fontWeight: '800',
  },
  rhythmTrack: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  rhythmSegment: {
    backgroundColor: '#d7e5f6',
    borderRadius: 999,
    flex: 1,
    height: 8,
  },
  rhythmSegmentDone: {
    backgroundColor: '#1976ee',
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  progressCell: {
    backgroundColor: '#edf5ff',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 74,
    paddingHorizontal: 10,
  },
  progressValue: {
    color: '#17233a',
    fontSize: 18,
    fontWeight: '900',
  },
  progressLabel: {
    color: '#6e7d94',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  nextRhythmAction: {
    alignItems: 'center',
    backgroundColor: '#17233a',
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 50,
  },
  nextRhythmActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scenarioTile: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    minHeight: 154,
    padding: 16,
    width: '48%',
  },
  scenarioTitle: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '800',
  },
  scenarioSubtitle: {
    color: '#697890',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  memoryPanel: {
    backgroundColor: 'rgba(247,251,255,0.68)',
    borderRadius: 26,
    marginTop: 24,
    padding: 20,
  },
});
