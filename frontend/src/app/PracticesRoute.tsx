import { PracticeSessionScreen } from '../screens/PracticeSessionScreen';
import { PracticesScreen } from '../screens/PracticesScreen';
import { practicePlansByLanguage } from '../i18n';
import type { FlowController } from './AppRouteTypes';
import type { Language } from '../types';

export function PracticesRoute({ flow, language }: { flow: FlowController; language: Language }) {
  const selectedPractice = flow.selectedPractice;
  const practicePlans = practicePlansByLanguage[language];

  if (!selectedPractice) {
    return (
      <PracticesScreen
        language={language}
        onBack={flow.goHome}
        onPractice={flow.startPractice}
        onScenario={flow.beginScenario}
      />
    );
  }

  return (
    <PracticeSessionScreen
      onBack={() => flow.setSelectedPractice(null)}
      onComplete={() => flow.completePractice(selectedPractice)}
      language={language}
      plan={practicePlans[selectedPractice.id]}
      scenario={selectedPractice}
    />
  );
}
