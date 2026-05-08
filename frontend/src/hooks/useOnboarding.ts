import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { OnboardingGoal, ScenarioId } from '../types';

const onboardingKey = 'reflecta:onboarding:v1';
const goalKey = 'reflecta:onboarding:goal';

export type OnboardingController = ReturnType<typeof useOnboarding>;

const onboardingGoalScenario: Record<OnboardingGoal, ScenarioId> = {
  calm: 'anxiety',
  sleep: 'sleep',
  burnout: 'burnout',
  journal: 'anxiety',
};

export function useOnboarding() {
  const [completed, setCompleted] = useState(false);
  const [goal, setGoal] = useState<OnboardingGoal>('calm');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const [storedCompleted, storedGoal] = await Promise.all([
          AsyncStorage.getItem(onboardingKey),
          AsyncStorage.getItem(goalKey),
        ]);

        setCompleted(storedCompleted === 'done');

        if (isOnboardingGoal(storedGoal)) {
          setGoal(storedGoal);
        }
      } finally {
        setReady(true);
      }
    };

    void restore();
  }, []);

  const complete = async () => {
    setCompleted(true);
    await Promise.all([
      AsyncStorage.setItem(onboardingKey, 'done'),
      AsyncStorage.setItem(goalKey, goal),
    ]);
  };

  const restore = async (nextGoal: OnboardingGoal) => {
    setGoal(nextGoal);
    setCompleted(true);
    await Promise.all([
      AsyncStorage.setItem(onboardingKey, 'done'),
      AsyncStorage.setItem(goalKey, nextGoal),
    ]);
  };

  const reset = async () => {
    setCompleted(false);
    setGoal('calm');
    await Promise.all([
      AsyncStorage.removeItem(onboardingKey),
      AsyncStorage.removeItem(goalKey),
    ]);
  };

  return {
    complete,
    completed,
    goal,
    scenarioId: onboardingGoalScenario[goal],
    ready,
    reset,
    restore,
    setGoal,
  };
}

function isOnboardingGoal(value: string | null): value is OnboardingGoal {
  return value === 'calm' || value === 'sleep' || value === 'burnout' || value === 'journal';
}
