import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { copy } from '../i18n';
import type { Language, OnboardingGoal } from '../types';

const calmImage = {
  uri: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=88',
};

const goalIds: OnboardingGoal[] = ['calm', 'sleep', 'burnout', 'journal'];

export function OnboardingScreen({
  goal,
  language,
  onComplete,
  onGoal,
}: {
  goal: OnboardingGoal;
  language: Language;
  onComplete: () => void;
  onGoal: (goal: OnboardingGoal) => void;
}) {
  const t = copy[language];

  return (
    <ImageBackground source={calmImage} style={styles.overlay}>
      <View style={styles.imageVeil}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Text style={styles.brand}>Reflecta</Text>
            <Text style={styles.step}>01</Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>{t.onboarding.kicker}</Text>
            <Text style={styles.title}>{t.onboarding.title}</Text>
            <Text style={styles.text}>{t.onboarding.text}</Text>
          </View>

          <View style={styles.goalDock}>
            <View style={styles.goalGrid}>
              {goalIds.map((id) => {
                const item = t.onboarding.goals[id];
                const selected = goal === id;

                return (
                  <Pressable
                    key={id}
                    style={[styles.goalItem, selected && styles.goalItemSelected]}
                    onPress={() => onGoal(id)}
                  >
                    <Text style={[styles.goalTitle, selected && styles.goalTitleSelected]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.goalText, selected && styles.goalTextSelected]}>
                      {item.text}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.safetyLine}>
              <Text style={styles.safetyText}>
                {t.onboarding.safety}
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.primaryAction} onPress={onComplete}>
                <Text style={styles.primaryActionText}>{t.common.start}</Text>
              </Pressable>
              <Pressable style={styles.secondaryAction} onPress={onComplete}>
                <Text style={styles.secondaryActionText}>{t.common.later}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 50,
  },
  imageVeil: {
    backgroundColor: 'rgba(7,15,22,0.44)',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
    padding: 20,
    paddingBottom: 16,
    paddingTop: 22,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  step: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    borderWidth: 1,
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroCopy: {
    marginTop: 74,
  },
  kicker: {
    color: '#d7ff7a',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 48,
    marginTop: 10,
    maxWidth: 350,
  },
  text: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 16,
    maxWidth: 320,
  },
  goalDock: {
    backgroundColor: '#f7f3ea',
    borderRadius: 30,
    marginTop: 34,
    padding: 14,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalItem: {
    backgroundColor: '#ffffff',
    borderColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 108,
    padding: 14,
  },
  goalItemSelected: {
    backgroundColor: '#111827',
    borderColor: '#d7ff7a',
  },
  goalTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 22,
  },
  goalTitleSelected: {
    color: '#ffffff',
  },
  goalText: {
    color: '#697386',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 10,
  },
  goalTextSelected: {
    color: '#d7ff7a',
  },
  safetyLine: {
    borderTopColor: '#e2d9c8',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 12,
  },
  safetyText: {
    color: '#697386',
    fontSize: 12,
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#d7ff7a',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryActionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: '#ebe5d8',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 56,
    width: 88,
  },
  secondaryActionText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '900',
  },
});
