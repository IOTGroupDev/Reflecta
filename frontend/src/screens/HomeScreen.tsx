import { Pressable, ScrollView, Text, View } from 'react-native';
import { PrimaryButton } from '../components/ui/ActionButton';
import { ScenarioMark } from '../components/ui/ScenarioMark';
import { scenarios } from '../data';
import { getDailyPlan } from '../plans';
import { styles } from '../theme/styles';
import type { JournalEntry, JournalSummary, Scenario } from '../types';

export function HomeScreen({
  lastEntry,
  onChat,
  onMood,
  onOpenAccount,
  onOpenJournal,
  onPractice,
  onSafety,
  onScenario,
  summary,
  userEmail,
  todayMood,
}: {
  lastEntry?: JournalEntry;
  onChat: () => void;
  onMood: (value: number) => void;
  onOpenAccount: () => void;
  onOpenJournal: () => void;
  onPractice: (scenario: Scenario) => void;
  onSafety: () => void;
  onScenario: (scenario: Scenario) => void;
  summary: JournalSummary | null;
  userEmail: string | null;
  todayMood: number | null;
}) {
  const topScenario = summary?.topScenario
    ? scenarios.find((item) => item.id === summary.topScenario?.id)
    : null;
  const dailyPlan = getDailyPlan(summary, todayMood, lastEntry);
  const avatarLetter = userEmail?.trim().charAt(0).toUpperCase() ?? 'R';

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.kicker}>Reflecta</Text>
          <Text style={styles.heroTitle}>Я рядом.</Text>
        </View>
        <Pressable style={styles.avatar} onPress={onOpenAccount}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
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
        <PrimaryButton label="Открыть практику" onPress={() => onPractice(dailyPlan.scenario)} />
      </View>

      <Pressable style={styles.talkPanel} onPress={onChat}>
        <View style={styles.talkDot}>
          <Text style={styles.talkDotText}>?</Text>
        </View>
        <View style={styles.talkCopy}>
          <Text style={styles.talkTitle}>Поговорить</Text>
          <Text style={styles.talkText}>
            Напиши, что происходит. Я отвечу коротко и бережно.
          </Text>
        </View>
      </Pressable>

      <Pressable style={styles.safetyStrip} onPress={onSafety}>
        <Text style={styles.safetyStripTitle}>Если сейчас небезопасно</Text>
        <Text style={styles.safetyStripText}>
          Не оставайся один. Открой быстрые шаги к живой помощи.
        </Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Как ты сегодня?</Text>
        <Text style={styles.sectionHint}>Отметь за 10 секунд</Text>
      </View>
      <View style={styles.moodRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            style={[styles.moodButton, todayMood === value && styles.moodButtonActive]}
            onPress={() => onMood(value)}
          >
            <Text style={[styles.moodButtonText, todayMood === value && styles.moodButtonTextActive]}>
              {value}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.progressPanel}>
        <View style={styles.progressHeader}>
          <Text style={styles.panelTitle}>Твой ритм</Text>
          <Pressable onPress={onOpenJournal}>
            <Text style={styles.linkText}>Дневник</Text>
          </Pressable>
        </View>
        <View style={styles.progressGrid}>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{summary?.moodCount ?? 0}</Text>
            <Text style={styles.progressLabel}>check-in</Text>
          </View>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{summary?.sessionCount ?? 0}</Text>
            <Text style={styles.progressLabel}>разборы</Text>
          </View>
          <View style={styles.progressCell}>
            <Text style={styles.progressValue}>{topScenario?.title ?? '—'}</Text>
            <Text style={styles.progressLabel}>часто</Text>
          </View>
        </View>
        <Text style={styles.panelText}>
          {todayMood
            ? 'Сегодняшний check-in уже сохранён. Следующий шаг — выбрать короткую практику под состояние.'
            : 'Начни с оценки состояния. Так приложение постепенно поймёт, что помогает именно тебе.'}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Быстрая помощь</Text>
        <Text style={styles.sectionHint}>Три сценария MVP</Text>
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
          {lastEntry ? 'Последняя запись' : 'Дневник эмоций'}
        </Text>
        <Text style={styles.panelText}>
          {lastEntry
            ? `${lastEntry.createdAt}: ${lastEntry.scenario.title}. Можно вернуться к тому, что помогло.`
            : 'Здесь появятся состояния, практики и маленькие выводы о твоей неделе.'}
        </Text>
      </View>
    </ScrollView>
  );
}
