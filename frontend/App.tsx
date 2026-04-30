import { StatusBar } from 'expo-status-bar';
import { styles } from './src/theme/styles';
import { AccountSheet } from './src/components/AccountSheet';
import { AuthGate } from './src/components/AuthGate';
import { SafetySheet } from './src/components/SafetySheet';
import { BottomNav } from './src/components/BottomNav';
import { ChatScreen } from './src/screens/ChatScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { JournalScreen } from './src/screens/JournalScreen';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { IntensityScreen } from './src/screens/IntensityScreen';
import { NoteScreen } from './src/screens/NoteScreen';
import { PracticeSessionScreen } from './src/screens/PracticeSessionScreen';
import { PracticesScreen } from './src/screens/PracticesScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { fallbackResults, practicePlans, scenarios } from './src/data';
import { apiUrl, supabase, yandexOAuthProvider } from './src/lib/supabase';
import type { AnalyzeResponse, AnalyzeResult, ApiChatMessage, ApiSession, ChatMessage, ChatResponse, Intensity, JournalEntry, JournalSummary, Scenario, Step, Tab } from './src/types';
import { Provider, Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  View,
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [step, setStep] = useState<Step>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<Scenario | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [note, setNote] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Я рядом. Можно написать одной фразой, что сейчас тяжело. Это конфиденциальное пространство для саморефлексии, не диагноз и не замена помощи специалиста.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [summary, setSummary] = useState<JournalSummary | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authEmail, setAuthEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authCodeSent, setAuthCodeSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);

  const lastEntry = journal[0];
  const authHeaders = useMemo(
    () =>
      session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : undefined,
    [session?.access_token],
  );

  const apiFetch = (path: string, init?: RequestInit) =>
    fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        ...(authHeaders ?? {}),
      },
    });

  const ensureSession = async () => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setSession(data.session);
      }
    } finally {
      setAuthReady(true);
    }
  };

  const redirectTo =
    typeof window !== 'undefined' ? window.location.origin : undefined;

  const requestEmailCode = async () => {
    if (!supabase) {
      setAuthMessage('Supabase env не настроен для фронта.');
      return;
    }

    if (!authEmail.trim()) {
      setAuthMessage('Введи email, чтобы получить код.');
      return;
    }

    setAuthLoading(true);
    setAuthMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail.trim(),
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: authMode === 'sign-up',
        },
      });

      if (error) {
        throw error;
      }

      setAuthCodeSent(true);
      setAuthCode('');
      setAuthMessage('Код отправлен на почту.');
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Не удалось отправить код.');
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!supabase) {
      setAuthMessage('Supabase env не настроен для фронта.');
      return;
    }

    if (!authEmail.trim() || authCode.trim().length < 4) {
      setAuthMessage('Введи email и код из письма.');
      return;
    }

    setAuthLoading(true);
    setAuthMessage('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: authEmail.trim(),
        token: authCode.trim(),
        type: 'email',
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setSession(data.session);
        setAuthCode('');
        setAuthCodeSent(false);
        setAccountOpen(false);
      }
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'Не удалось подтвердить код.');
    } finally {
      setAuthLoading(false);
    }
  };

  const submitAuth = () => {
    if (authCodeSent) {
      void verifyEmailCode();
      return;
    }

    void requestEmailCode();
  };

  const signInWithOAuth = async (provider: Provider | 'yandex') => {
    if (!supabase) {
      setAuthMessage('Supabase env не настроен для фронта.');
      return;
    }

    const providerName = provider === 'yandex' ? yandexOAuthProvider : provider;
    setAuthLoading(true);
    setAuthMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerName as Provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      setAuthMessage(error.message);
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setAccountOpen(false);
    setJournal([]);
    setSummary(null);
    setChatMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Я рядом. Можно написать одной фразой, что сейчас тяжело. Это конфиденциальное пространство для саморефлексии, не диагноз и не замена помощи специалиста.',
      },
    ]);
  };

  const refreshJournal = async () => {
    try {
      if (!authHeaders) {
        return;
      }

      const response = await apiFetch('/journal/sessions');

      if (!response.ok) {
        return;
      }

      const sessions = (await response.json()) as ApiSession[];

      setJournal(
        sessions.map((session) => {
          const scenario =
            scenarios.find((item) => item.id === session.scenario) ?? scenarios[0];

          return {
            id: session.id,
            scenario,
            level: session.level,
            details: session.details,
            note: session.text ?? '',
            result: session.result,
            createdAt: new Date(session.createdAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }),
      );
    } catch {
      // The local in-memory journal still works if the API is unavailable.
    }
  };

  const refreshSummary = async () => {
    try {
      if (!authHeaders) {
        return;
      }

      const response = await apiFetch('/journal/summary');

      if (response.ok) {
        setSummary((await response.json()) as JournalSummary);
      }
    } catch {
      // Insights remain empty when the API is unavailable.
    }
  };

  const refreshChatHistory = async () => {
    try {
      if (!authHeaders) {
        return;
      }

      const response = await apiFetch('/chat/history');

      if (!response.ok) {
        return;
      }

      const messages = (await response.json()) as ApiChatMessage[];

      if (messages.length > 0) {
        setChatMessages(
          messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        );
      }
    } catch {
      // The local chat still works if the API is unavailable.
    }
  };

  useEffect(() => {
    void ensureSession();

    if (!supabase) {
      return undefined;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authHeaders) {
      return;
    }

    void refreshJournal();
    void refreshSummary();
    void refreshChatHistory();
  }, [authHeaders]);

  const selectedDetailLabels = useMemo(() => {
    if (!selectedScenario) {
      return [];
    }

    return selectedScenario.details
      .filter((item) => selectedDetails.includes(item.id))
      .map((item) => item.label);
  }, [selectedDetails, selectedScenario]);

  const beginScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSelectedDetails([]);
    setIntensity('medium');
    setNote('');
    setResult(null);
    setStep('details');
    setActiveTab('today');
  };

  const openChat = () => {
    resetFlow();
    setActiveTab('chat');
  };

  const openJournal = () => {
    resetFlow();
    setActiveTab('journal');
  };

  const startPractice = (scenario: Scenario) => {
    resetFlow();
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

  const analyze = async () => {
    if (!selectedScenario) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: selectedScenario.id,
          details: selectedDetails,
          level: intensity,
          text: note,
        }),
      });

      if (!response.ok) {
        throw new Error('Analyze request failed');
      }

      const payload = (await response.json()) as AnalyzeResponse;
      setResult(payload.result);
    } catch {
      setResult(fallbackResults[selectedScenario.id]);
    } finally {
      setLoading(false);
      setStep('result');
    }
  };

  const saveResult = () => {
    if (!selectedScenario || !result) {
      return;
    }

    const entry: JournalEntry = {
      id: `${Date.now()}`,
      scenario: selectedScenario,
      level: intensity,
      details: selectedDetailLabels,
      note,
      result,
      createdAt: new Date().toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setJournal((current) => [
      entry,
      ...current,
    ]);

    if (!authHeaders) {
      Alert.alert('Не удалось сохранить', 'Supabase Auth session пока не готова.');
      return;
    }

    void apiFetch('/journal/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: selectedScenario.id,
        details: selectedDetailLabels,
        level: intensity,
        text: note,
        result,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return Promise.all([refreshJournal(), refreshSummary()]);
        }

        return undefined;
      })
      .catch(() => undefined);

    Alert.alert('Сохранено', 'Запись добавлена в дневник эмоций.');
    void refreshSummary();
  };

  const saveMood = (value: number) => {
    setTodayMood(value);

    if (!authHeaders) {
      return;
    }

    void apiFetch('/journal/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mood: value <= 2 ? 'low' : value === 3 ? 'neutral' : 'good',
        rating: value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return refreshSummary();
        }

        return undefined;
      })
      .catch(() => undefined);
  };

  const resetFlow = () => {
    setStep('home');
    setSelectedScenario(null);
    setSelectedPractice(null);
    setSelectedDetails([]);
    setIntensity('medium');
    setNote('');
    setResult(null);
  };

  const sendChatMessage = async (preset?: string) => {
    const content = (preset ?? chatInput).trim();

    if (!content || chatLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
    };

    const history = [...chatMessages, userMessage];
    setChatMessages(history);
    setChatInput('');
    setChatLoading(true);

    try {
      if (!authHeaders) {
        throw new Error('Auth session is not ready');
      }

      const response = await apiFetch('/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: chatMessages.map(({ role, content: text }) => ({
            role,
            content: text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const payload = (await response.json()) as ChatResponse;
      if (payload.safety === 'crisis') {
        setSafetyOpen(true);
      }

      setChatMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: payload.message,
        },
      ]);
      void refreshChatHistory();
    } catch {
      setChatMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content:
            'Я рядом. Похоже, связь с сервером прервалась. Пока можно выбрать практику тревоги, сна или выгорания.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const completePractice = (scenario: Scenario) => {
    const plan = practicePlans[scenario.id];
    const practiceResult: AnalyzeResult = {
      title: `Практика завершена: ${plan.title}`,
      what: plan.setup,
      why: ['ты выбрал короткое действие вместо бесконечного анализа'],
      actions: plan.steps,
      relief: {
        title: plan.title,
        duration: plan.duration,
        steps: plan.steps,
      },
      note: plan.after,
    };

    const entry: JournalEntry = {
      id: `${Date.now()}-practice`,
      scenario,
      level: 'low',
      details: ['Практика'],
      note: '',
      result: practiceResult,
      createdAt: new Date().toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setJournal((current) => [entry, ...current]);
    setSelectedPractice(null);

    if (!authHeaders) {
      Alert.alert('Практика завершена', 'Войди, чтобы сохранить её в дневник.');
      return;
    }

    void apiFetch('/journal/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: scenario.id,
        details: ['Практика'],
        level: 'low',
        text: plan.after,
        result: practiceResult,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return Promise.all([refreshJournal(), refreshSummary()]);
        }

        return undefined;
      })
      .catch(() => undefined);

    Alert.alert('Сохранено', 'Практика добавлена в дневник.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        {activeTab === 'today' && (
          <>
            {step === 'home' && (
              <HomeScreen
                lastEntry={lastEntry}
                onChat={openChat}
                onMood={saveMood}
                onOpenAccount={() => setAccountOpen(true)}
                onOpenJournal={openJournal}
                onPractice={startPractice}
                onSafety={() => setSafetyOpen(true)}
                onScenario={beginScenario}
                summary={summary}
                userEmail={session?.user.email ?? null}
                todayMood={todayMood}
              />
            )}
            {step === 'details' && selectedScenario && (
              <DetailsScreen
                scenario={selectedScenario}
                selectedDetails={selectedDetails}
                onBack={resetFlow}
                onNext={() => setStep('intensity')}
                onToggle={toggleDetail}
              />
            )}
            {step === 'intensity' && selectedScenario && (
              <IntensityScreen
                intensity={intensity}
                scenario={selectedScenario}
                onBack={() => setStep('details')}
                onNext={() => setStep('note')}
                onSelect={setIntensity}
              />
            )}
            {step === 'note' && selectedScenario && (
              <NoteScreen
                loading={loading}
                note={note}
                scenario={selectedScenario}
                onAnalyze={analyze}
                onBack={() => setStep('intensity')}
                onNote={setNote}
              />
            )}
            {step === 'result' && selectedScenario && result && (
              <ResultScreen
                result={result}
                scenario={selectedScenario}
                onAgain={resetFlow}
                onSave={saveResult}
              />
            )}
          </>
        )}

        {activeTab === 'chat' && (
          <ChatScreen
            input={chatInput}
            loading={chatLoading}
            messages={chatMessages}
            onChangeInput={setChatInput}
            onPractice={startPractice}
            onSafety={() => setSafetyOpen(true)}
            onScenario={beginScenario}
            onSend={sendChatMessage}
          />
        )}
        {activeTab === 'practices' && (
          selectedPractice ? (
            <PracticeSessionScreen
              onBack={() => setSelectedPractice(null)}
              onComplete={() => completePractice(selectedPractice)}
              plan={practicePlans[selectedPractice.id]}
              scenario={selectedPractice}
            />
          ) : (
            <PracticesScreen onPractice={startPractice} onScenario={beginScenario} />
          )
        )}
        {activeTab === 'journal' && (
          <JournalScreen entries={journal} onScenario={beginScenario} />
        )}
        {activeTab === 'insights' && (
          <InsightsScreen
            onPractice={startPractice}
            summary={summary}
          />
        )}

        {!session && (
          <AuthGate
            code={authCode}
            codeSent={authCodeSent}
            email={authEmail}
            loading={authLoading}
            message={authMessage}
            mode={authMode}
            ready={authReady}
            onChangeCode={setAuthCode}
            onChangeEmail={setAuthEmail}
            onChangeMode={(nextMode) => {
              setAuthMode(nextMode);
              setAuthCode('');
              setAuthCodeSent(false);
              setAuthMessage('');
            }}
            onOAuth={(provider) => void signInWithOAuth(provider)}
            onResend={requestEmailCode}
            onSubmit={submitAuth}
          />
        )}

        {accountOpen && session && (
          <AccountSheet
            email={session.user.email ?? 'Supabase user'}
            onClose={() => setAccountOpen(false)}
            onSignOut={signOut}
          />
        )}

        {safetyOpen && <SafetySheet onClose={() => setSafetyOpen(false)} />}

        <BottomNav activeTab={activeTab} onChange={setActiveTab} onHome={resetFlow} />
      </View>
    </SafeAreaView>
  );
}
