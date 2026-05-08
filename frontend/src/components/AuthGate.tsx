import { Provider } from '@supabase/supabase-js';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { copy } from '../i18n';
import type { Language } from '../types';

const heroImage = {
  uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=88',
};

export function AuthGate({
  code,
  codeSent,
  email,
  language,
  loading,
  message,
  onChangeCode,
  onChangeEmail,
  onOAuth,
  onResend,
  onSubmit,
  ready,
  resendAvailableInSeconds = 0,
}: {
  code: string;
  codeSent: boolean;
  email: string;
  language: Language;
  loading: boolean;
  message: string;
  onChangeCode: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onOAuth: (provider: Provider | 'yandex') => void;
  onResend: () => void;
  onSubmit: () => void;
  ready: boolean;
  resendAvailableInSeconds?: number;
}) {
  const t = copy[language];

  if (!ready) {
    return (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingPanel}>
          <ActivityIndicator color="#d7ff7a" />
          <Text style={styles.authLoadingText}>{t.auth.checking}</Text>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={heroImage} style={styles.authOverlay}>
      <View style={styles.imageVeil}>
        <ScrollView contentContainerStyle={styles.authContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Text style={styles.brand}>Reflecta</Text>
            <Text style={styles.privacyBadge}>{t.auth.private}</Text>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.authTitle}>{t.auth.title}</Text>
            <Text style={styles.authText}>{t.auth.text}</Text>
          </View>

          <View style={styles.signalRow}>
            <View style={styles.signalItem}>
              <Text style={styles.signalValue}>{t.auth.practiceValue}</Text>
              <Text style={styles.signalLabel}>{t.auth.practiceLabel}</Text>
            </View>
            <View style={styles.signalItem}>
              <Text style={styles.signalValue}>{t.auth.quietValue}</Text>
              <Text style={styles.signalLabel}>{t.auth.quietLabel}</Text>
            </View>
          </View>

          <View style={styles.authDock}>
            <Text style={styles.formTitle}>{codeSent ? t.auth.formTitleSent : t.auth.formTitleIdle}</Text>
            <Text style={styles.formText}>
              {codeSent
                ? t.auth.formTextSent
                : t.auth.formTextIdle}
            </Text>

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={onChangeEmail}
              placeholder="email"
              placeholderTextColor="#7b8494"
              style={styles.authInput}
              value={email}
            />
            {codeSent ? (
              <TextInput
                keyboardType="number-pad"
                onChangeText={onChangeCode}
                onSubmitEditing={onSubmit}
                placeholder={t.auth.codePlaceholder}
                placeholderTextColor="#7b8494"
                style={styles.authInput}
                value={code}
              />
            ) : null}

            {message ? <Text style={styles.authMessage}>{message}</Text> : null}

            <Pressable style={styles.primaryAction} onPress={onSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#111827" />
              ) : (
                <Text style={styles.primaryActionText}>
                  {codeSent ? t.auth.submitSent : t.auth.submitIdle}
                </Text>
              )}
            </Pressable>

            {codeSent ? (
              <Pressable
                style={styles.resendButton}
                onPress={onResend}
                disabled={loading || resendAvailableInSeconds > 0}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    (loading || resendAvailableInSeconds > 0) && styles.resendButtonTextDisabled,
                  ]}
                >
                  {resendAvailableInSeconds > 0
                    ? t.auth.resendIn(formatCountdown(resendAvailableInSeconds, language))
                    : t.auth.resend}
                </Text>
              </Pressable>
            ) : null}

            <View style={styles.oauthRow}>
              <Pressable style={styles.oauthButton} onPress={() => onOAuth('google')} disabled={loading}>
                <Text style={styles.oauthButtonText}>Google</Text>
              </Pressable>
              <Pressable style={styles.oauthButton} onPress={() => onOAuth('apple')} disabled={loading}>
                <Text style={styles.oauthButtonText}>Apple</Text>
              </Pressable>
              <Pressable style={styles.oauthButton} onPress={() => onOAuth('yandex')} disabled={loading}>
                <Text style={styles.oauthButtonText}>Yandex</Text>
              </Pressable>
            </View>

            <Text style={styles.authFootnote}>
              {t.auth.footnote}
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  authOverlay: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  imageVeil: {
    backgroundColor: 'rgba(6,13,24,0.48)',
    flex: 1,
  },
  loadingOverlay: {
    alignItems: 'center',
    backgroundColor: '#111827',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  loadingPanel: {
    alignItems: 'center',
    gap: 12,
  },
  authContent: {
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
  privacyBadge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 999,
    borderWidth: 1,
    color: '#f7fafc',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  heroCopy: {
    marginTop: 58,
  },
  authTitle: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 50,
    maxWidth: 340,
  },
  authText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 16,
    maxWidth: 330,
  },
  signalRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  signalItem: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 68,
    padding: 13,
  },
  signalValue: {
    color: '#d7ff7a',
    fontSize: 16,
    fontWeight: '900',
  },
  signalLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  authDock: {
    backgroundColor: '#f7f3ea',
    borderRadius: 30,
    marginTop: 34,
    padding: 18,
    width: '100%',
  },
  authLoadingText: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  formTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  formText: {
    color: '#586174',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  authInput: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    color: '#111827',
    fontSize: 16,
    marginTop: 12,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  authMessage: {
    color: '#586174',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 12,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#d7ff7a',
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 56,
  },
  primaryActionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  resendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 42,
  },
  resendButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '900',
  },
  resendButtonTextDisabled: {
    color: '#9aa3b2',
  },
  oauthRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  oauthButton: {
    alignItems: 'center',
    backgroundColor: '#ebe5d8',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  oauthButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
  },
  authFootnote: {
    color: '#70798a',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 14,
  },
});

function formatCountdown(totalSeconds: number, language: Language) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return copy[language].authMessages.seconds(seconds);
  }

  return copy[language].authMessages.minutes(minutes, seconds);
}
