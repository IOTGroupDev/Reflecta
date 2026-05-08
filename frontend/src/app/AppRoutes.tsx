import type { Language, ScenarioId } from '../types';
import { ChatScreen } from '../screens/ChatScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PracticesRoute } from './PracticesRoute';
import { TodayRoutes } from './TodayRoutes';
import type { ChatController, FlowController, JournalController } from './AppRouteTypes';
import type { MeProfile, OnboardingGoal } from '../types';

type AppRoutesProps = {
  chat: ChatController;
  flow: FlowController;
  journal: JournalController;
  language: Language;
  onOpenAccount: () => void;
  onOpenSafety: () => void;
  onDeleteAccount: () => void;
  onDeleteData: () => void;
  onExportData: () => void;
  onExportMarkdown: () => void;
  onLanguage: (language: Language) => void;
  onPrivacyPinDisable: () => void;
  onPrivacyPinEnable: (pin: string) => void;
  onProfileAvatar: () => void;
  onProfileFocus: (goal: OnboardingGoal) => void;
  onSaveIdentity: (data: { name: string; timezone: string }) => void;
  onSetReminderTime: (time: string) => void;
  onSignOut: () => void;
  onToggleReminder: () => void;
  privacyPinEnabled: boolean;
  profile: MeProfile | null;
  starterGoalLabel?: string;
  starterScenarioId?: ScenarioId;
  userEmail: string | null;
  userAvatarUrl: string | null;
  userName: string | null;
};

export function AppRoutes({
  chat,
  flow,
  journal,
  language,
  onOpenAccount,
  onOpenSafety,
  onDeleteAccount,
  onDeleteData,
  onExportData,
  onExportMarkdown,
  onLanguage,
  onPrivacyPinDisable,
  onPrivacyPinEnable,
  onProfileAvatar,
  onProfileFocus,
  onSaveIdentity,
  onSetReminderTime,
  onSignOut,
  onToggleReminder,
  privacyPinEnabled,
  profile,
  starterGoalLabel,
  starterScenarioId,
  userEmail,
  userAvatarUrl,
  userName,
}: AppRoutesProps) {
  return (
    <>
      {flow.activeTab === 'today' && (
        <TodayRoutes
          flow={flow}
          journal={journal}
          language={language}
          onOpenAccount={onOpenAccount}
          onOpenSafety={onOpenSafety}
          starterGoalLabel={starterGoalLabel}
          starterScenarioId={starterScenarioId}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          userName={userName}
        />
      )}

      {flow.activeTab === 'chat' && (
        <ChatScreen
          input={chat.input}
          language={language}
          loading={chat.loading}
          messages={chat.messages}
          onAttachDocument={chat.attachDocument}
          onAttachPhoto={chat.attachPhoto}
          onChangeInput={chat.setInput}
          onBack={flow.goHome}
          onPractice={flow.startPractice}
          onRemoveAttachment={chat.removePendingAttachment}
          onSafety={onOpenSafety}
          onScenario={flow.beginScenario}
          onSend={chat.send}
          pendingAttachments={chat.pendingAttachments}
        />
      )}
      {flow.activeTab === 'practices' && (
        <PracticesRoute flow={flow} language={language} />
      )}
      {flow.activeTab === 'journal' && (
        <JournalScreen
          entries={journal.entries}
          language={language}
          onBack={flow.goHome}
          onDeleteEntry={journal.deleteEntry}
          onScenario={flow.beginScenario}
        />
      )}
      {flow.activeTab === 'insights' && (
        <InsightsScreen
          language={language}
          onBack={flow.goHome}
          onPractice={flow.startPractice}
          onWeeklyAiSummary={journal.refreshWeeklyAiSummary}
          summary={journal.summary}
          weeklyAiSummary={journal.weeklyAiSummary}
          weeklyAiSummaryLoading={journal.weeklyAiSummaryLoading}
        />
      )}
      {flow.activeTab === 'profile' && (
        <ProfileScreen
          email={userEmail}
          language={language}
          onDeleteAccount={onDeleteAccount}
          onDeleteData={onDeleteData}
          onExportData={onExportData}
          onExportMarkdown={onExportMarkdown}
          onFocus={onProfileFocus}
          onLanguage={onLanguage}
          onPrivacyPinDisable={onPrivacyPinDisable}
          onPrivacyPinEnable={onPrivacyPinEnable}
          onProfileAvatar={onProfileAvatar}
          onSaveIdentity={onSaveIdentity}
          onSetReminderTime={onSetReminderTime}
          onSignOut={onSignOut}
          onToggleReminder={onToggleReminder}
          privacyPinEnabled={privacyPinEnabled}
          profile={profile}
        />
      )}
    </>
  );
}
