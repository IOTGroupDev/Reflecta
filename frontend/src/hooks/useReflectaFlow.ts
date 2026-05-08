import { Alert } from 'react-native';
import { useMemo, useState } from 'react';
import { copy, practicePlansByLanguage } from '../i18n';
import {
  analyzeState,
  createJournalEntry,
  postJournalSession,
  type ApiFetch,
} from '../api/reflectaApi';
import type { ActivityTag, AnalyzeResult, Intensity, JournalEntry, Language, Scenario, Step, Tab } from '../types';

export type FlowController = ReturnType<typeof useReflectaFlow>;

export function useReflectaFlow({
  addJournalEntry,
  apiFetch,
  hasAuthSession,
  language,
  refreshJournal,
  refreshSummary,
}: {
  addJournalEntry: (entry: JournalEntry) => void;
  apiFetch: ApiFetch;
  hasAuthSession: boolean;
  language: Language;
  refreshJournal: () => Promise<void>;
  refreshSummary: () => Promise<void>;
}) {
  const t = copy[language];
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [step, setStep] = useState<Step>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<Scenario | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [selectedActivityTags, setSelectedActivityTags] = useState<ActivityTag[]>([]);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [note, setNote] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedDetailLabels = useMemo(() => {
    if (!selectedScenario) {
      return [];
    }

    return selectedScenario.details
      .filter((item) => selectedDetails.includes(item.id))
      .map((item) => item.label);
  }, [selectedDetails, selectedScenario]);

  const reset = () => {
    setStep('home');
    setSelectedScenario(null);
    setSelectedPractice(null);
    setSelectedDetails([]);
    setSelectedActivityTags([]);
    setIntensity('medium');
    setNote('');
    setResult(null);
  };

  const goHome = () => {
    reset();
    setActiveTab('today');
  };

  const beginScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSelectedPractice(null);
    setSelectedDetails([]);
    setSelectedActivityTags([]);
    setIntensity('medium');
    setNote('');
    setResult(null);
    setStep('details');
    setActiveTab('today');
  };

  const openChat = () => {
    reset();
    setActiveTab('chat');
  };

  const openJournal = () => {
    reset();
    setActiveTab('journal');
  };

  const startPractice = (scenario: Scenario) => {
    reset();
    setSelectedPractice(scenario);
    setActiveTab('practices');
  };

  const toggleDetail = (id: string) => {
    setSelectedDetails((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleActivityTag = (tag: ActivityTag) => {
    setSelectedActivityTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const analyze = async () => {
    if (!selectedScenario) {
      return;
    }

    if (!hasAuthSession) {
      Alert.alert(t.alerts.needSignIn, t.alerts.signInToAnalyze);
      return;
    }

    setLoading(true);

    try {
      const nextResult = await analyzeState({
        apiFetch,
        scenario: selectedScenario,
        activityTags: selectedActivityTags,
        details: selectedDetails,
        intensity,
        language,
        note,
      });
      setResult(nextResult);
    } finally {
      setLoading(false);
      setStep('result');
    }
  };

  const saveResult = () => {
    if (!selectedScenario || !result) {
      return;
    }

    const entry = createJournalEntry({
      scenario: selectedScenario,
      activityTags: selectedActivityTags,
      level: intensity,
      details: selectedDetailLabels,
      note,
      result,
    });

    addJournalEntry(entry);

    if (!hasAuthSession) {
      Alert.alert(t.alerts.needSignIn, t.alerts.saveNeedsSignIn);
      return;
    }

    void postJournalSession({
      apiFetch,
      scenario: selectedScenario,
      activityTags: selectedActivityTags,
      details: selectedDetailLabels,
      level: intensity,
      text: note,
      result,
    })
      .then((response) => {
        if (response.ok) {
          return Promise.all([refreshJournal(), refreshSummary()]);
        }

        return undefined;
      })
      .catch(() => undefined);

    Alert.alert(t.alerts.saved, t.alerts.journalSaved);
    void refreshSummary();
  };

  const completePractice = (scenario: Scenario) => {
    const plan = practicePlansByLanguage[language][scenario.id];
    const practiceResult: AnalyzeResult = {
      title: t.common.practiceCompleted(plan.title),
      what: plan.setup,
      why: [
        t.common.practiceReason,
      ],
      actions: plan.steps,
      relief: {
        title: plan.title,
        duration: plan.duration,
        steps: plan.steps,
      },
      note: plan.after,
    };

    const entry = createJournalEntry({
      scenario,
      activityTags: [],
      level: 'low',
      details: [t.common.practice],
      note: '',
      result: practiceResult,
      suffix: '-practice',
    });

    addJournalEntry(entry);
    setSelectedPractice(null);

    if (!hasAuthSession) {
      Alert.alert(t.alerts.needSignIn, t.alerts.saveNeedsSignIn);
      return;
    }

    void postJournalSession({
      apiFetch,
      scenario,
      activityTags: [],
      details: [t.common.practice],
      level: 'low',
      text: plan.after,
      result: practiceResult,
    })
      .then((response) => {
        if (response.ok) {
          return Promise.all([refreshJournal(), refreshSummary()]);
        }

        return undefined;
      })
      .catch(() => undefined);

    Alert.alert(t.alerts.saved, t.alerts.practiceSaved);
  };

  return {
    activeTab,
    analyze,
    beginScenario,
    completePractice,
    goHome,
    intensity,
    loading,
    note,
    openChat,
    openJournal,
    reset,
    result,
    selectedDetails,
    selectedActivityTags,
    selectedPractice,
    selectedScenario,
    setActiveTab,
    setIntensity,
    setNote,
    setSelectedPractice,
    setStep,
    startPractice,
    step,
    saveResult,
    toggleDetail,
    toggleActivityTag,
  };
}
