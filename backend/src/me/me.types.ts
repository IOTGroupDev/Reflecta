export type OnboardingGoal = 'calm' | 'sleep' | 'burnout' | 'journal';

export interface UpdatePreferencesDto {
  onboardingGoal?: OnboardingGoal;
  timezone?: string;
  dailyReminderEnabled?: boolean;
  dailyReminderTime?: string;
  privacyAccepted?: boolean;
}

export interface UpdateMeDto {
  avatarUrl?: string | null;
  name?: string;
}
