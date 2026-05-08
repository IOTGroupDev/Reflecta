import { AccountSheet } from '../components/AccountSheet';
import { AuthGate } from '../components/AuthGate';
import { OnboardingScreen } from '../components/OnboardingScreen';
import { SafetySheet } from '../components/SafetySheet';
import type { OnboardingController } from '../hooks/useOnboarding';
import type { AuthController } from '../hooks/useSupabaseAuth';
import type { UserProfileController } from '../hooks/useUserProfile';
import type { Language } from '../types';

type AppOverlaysProps = {
  accountOpen: boolean;
  auth: AuthController;
  language: Language;
  onCloseAccount: () => void;
  onCloseSafety: () => void;
  onDeleteAccount: () => void;
  onDeleteData: () => void;
  onExportData: () => void;
  onExportMarkdown: () => void;
  onLanguage: (language: Language) => void;
  onSetReminderTime: (time: string) => void;
  onToggleReminder: () => void;
  onSignOut: () => void;
  onboarding: OnboardingController;
  profile: UserProfileController;
  safetyOpen: boolean;
};

export function AppOverlays({
  accountOpen,
  auth,
  language,
  onCloseAccount,
  onCloseSafety,
  onDeleteAccount,
  onDeleteData,
  onExportData,
  onExportMarkdown,
  onLanguage,
  onSetReminderTime,
  onToggleReminder,
  onSignOut,
  onboarding,
  profile,
  safetyOpen,
}: AppOverlaysProps) {
  const serverOnboardingGoal = profile.profile?.profile?.onboardingGoal;
  const shouldShowOnboarding =
    Boolean(auth.session) &&
    onboarding.ready &&
    profile.ready &&
    !serverOnboardingGoal &&
    !onboarding.completed;

  return (
    <>
      {shouldShowOnboarding && (
        <OnboardingScreen
          goal={onboarding.goal}
          language={language}
          onComplete={() => void onboarding.complete()}
          onGoal={onboarding.setGoal}
        />
      )}

      {!auth.session && (
        <AuthGate
          code={auth.authCode}
          codeSent={auth.authCodeSent}
          email={auth.authEmail}
          language={language}
          loading={auth.authLoading}
          message={auth.authMessage}
          ready={auth.authReady}
          resendAvailableInSeconds={auth.resendAvailableInSeconds}
          onChangeCode={auth.setAuthCode}
          onChangeEmail={auth.setAuthEmail}
          onOAuth={(provider) => void auth.signInWithOAuth(provider)}
          onResend={auth.requestEmailCode}
          onSubmit={auth.submitAuth}
        />
      )}

      {accountOpen && auth.session && (
        <AccountSheet
          email={auth.session.user.email ?? 'Supabase user'}
          language={language}
          onClose={onCloseAccount}
          onDeleteAccount={onDeleteAccount}
          onDeleteData={onDeleteData}
          onExportData={onExportData}
          onExportMarkdown={onExportMarkdown}
          onLanguage={onLanguage}
          onSetReminderTime={onSetReminderTime}
          onToggleReminder={onToggleReminder}
          onSignOut={onSignOut}
          profile={profile.profile}
        />
      )}

      {safetyOpen && <SafetySheet language={language} onClose={onCloseSafety} />}
    </>
  );
}
