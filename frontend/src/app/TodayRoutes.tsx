import type { Language, ScenarioId } from '../types';
import { DetailsScreen } from '../screens/DetailsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { IntensityScreen } from '../screens/IntensityScreen';
import { NoteScreen } from '../screens/NoteScreen';
import { ResultScreen } from '../screens/ResultScreen';
import type { FlowController, JournalController } from './AppRouteTypes';

type TodayRoutesProps = {
  flow: FlowController;
  journal: JournalController;
  language: Language;
  onOpenAccount: () => void;
  onOpenSafety: () => void;
  starterGoalLabel?: string;
  starterScenarioId?: ScenarioId;
  userEmail: string | null;
  userAvatarUrl: string | null;
  userName: string | null;
};

export function TodayRoutes({
  flow,
  journal,
  language,
  onOpenAccount,
  onOpenSafety,
  starterGoalLabel,
  starterScenarioId,
  userEmail,
  userAvatarUrl,
  userName,
}: TodayRoutesProps) {
  const lastEntry = journal.entries[0];

  return (
    <>
      {flow.step === 'home' && (
        <HomeScreen
          language={language}
          lastEntry={lastEntry}
          onChat={flow.openChat}
          onMood={journal.saveMood}
          onOpenAccount={onOpenAccount}
          onOpenJournal={flow.openJournal}
          onPractice={flow.startPractice}
          onSafety={onOpenSafety}
          onScenario={flow.beginScenario}
          summary={journal.summary}
          starterGoalLabel={starterGoalLabel}
          starterScenarioId={starterScenarioId}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          userName={userName}
          todayMood={journal.todayMood}
        />
      )}
      {flow.step === 'details' && flow.selectedScenario && (
        <DetailsScreen
          language={language}
          scenario={flow.selectedScenario}
          selectedDetails={flow.selectedDetails}
          onBack={flow.reset}
          onNext={() => flow.setStep('intensity')}
          onToggle={flow.toggleDetail}
        />
      )}
      {flow.step === 'intensity' && flow.selectedScenario && (
        <IntensityScreen
          language={language}
          intensity={flow.intensity}
          scenario={flow.selectedScenario}
          onBack={() => flow.setStep('details')}
          onNext={() => flow.setStep('note')}
          onSelect={flow.setIntensity}
        />
      )}
      {flow.step === 'note' && flow.selectedScenario && (
        <NoteScreen
          language={language}
          loading={flow.loading}
          note={flow.note}
          scenario={flow.selectedScenario}
          onAnalyze={flow.analyze}
          onBack={() => flow.setStep('intensity')}
          onNote={flow.setNote}
          onToggleActivityTag={flow.toggleActivityTag}
          selectedActivityTags={flow.selectedActivityTags}
        />
      )}
      {flow.step === 'result' && flow.selectedScenario && flow.result && (
        <ResultScreen
          language={language}
          result={flow.result}
          scenario={flow.selectedScenario}
          onAgain={flow.reset}
          onBack={() => flow.setStep('note')}
          onSave={flow.saveResult}
        />
      )}
    </>
  );
}
