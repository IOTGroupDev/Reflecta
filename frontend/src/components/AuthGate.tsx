import { Provider } from '@supabase/supabase-js';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../theme/styles';
import { PrimaryButton } from './ui/ActionButton';

export function AuthGate({
  code,
  codeSent,
  email,
  loading,
  message,
  mode,
  onChangeCode,
  onChangeEmail,
  onChangeMode,
  onOAuth,
  onResend,
  onSubmit,
  ready,
}: {
  code: string;
  codeSent: boolean;
  email: string;
  loading: boolean;
  message: string;
  mode: 'sign-in' | 'sign-up';
  onChangeCode: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeMode: (value: 'sign-in' | 'sign-up') => void;
  onOAuth: (provider: Provider | 'yandex') => void;
  onResend: () => void;
  onSubmit: () => void;
  ready: boolean;
}) {
  if (!ready) {
    return (
      <View style={styles.authOverlay}>
        <View style={styles.authPanel}>
          <ActivityIndicator color="#1976ee" />
          <Text style={styles.authLoadingText}>Проверяю сессию...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.authOverlay}>
      <View style={styles.authPanel}>
        <Text style={styles.kicker}>Reflecta</Text>
        <Text style={styles.authTitle}>Вход без пароля</Text>
        <Text style={styles.authText}>
          Получи код на почту или войди через провайдера. Supabase Auth создаст личный UUID для дневника.
        </Text>

        <View style={styles.authBenefits}>
          <Text style={styles.authBenefit}>• пароль не нужен</Text>
          <Text style={styles.authBenefit}>• код приходит на email</Text>
          <Text style={styles.authBenefit}>• OAuth: Google, Apple, Yandex</Text>
        </View>

        <View style={styles.authSwitch}>
          <Pressable
            style={[styles.authSwitchButton, mode === 'sign-in' && styles.authSwitchButtonActive]}
            onPress={() => onChangeMode('sign-in')}
          >
            <Text
              style={[
                styles.authSwitchText,
                mode === 'sign-in' && styles.authSwitchTextActive,
              ]}
            >
              Вход
            </Text>
          </Pressable>
          <Pressable
            style={[styles.authSwitchButton, mode === 'sign-up' && styles.authSwitchButtonActive]}
            onPress={() => onChangeMode('sign-up')}
          >
            <Text
              style={[
                styles.authSwitchText,
                mode === 'sign-up' && styles.authSwitchTextActive,
              ]}
            >
              Регистрация
            </Text>
          </Pressable>
        </View>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={onChangeEmail}
          placeholder="email"
          placeholderTextColor="#8290a6"
          style={styles.authInput}
          value={email}
        />
        {codeSent ? (
          <TextInput
            keyboardType="number-pad"
            onChangeText={onChangeCode}
            onSubmitEditing={onSubmit}
            placeholder="код из письма"
            placeholderTextColor="#8290a6"
            style={styles.authInput}
            value={code}
          />
        ) : null}

        {message ? <Text style={styles.authMessage}>{message}</Text> : null}

        <PrimaryButton
          label={codeSent ? 'Подтвердить код' : 'Получить код'}
          loading={loading}
          onPress={onSubmit}
        />
        {codeSent ? (
          <Pressable style={styles.resendButton} onPress={onResend} disabled={loading}>
            <Text style={styles.resendButtonText}>Отправить код ещё раз</Text>
          </Pressable>
        ) : null}

        <View style={styles.oauthDivider}>
          <View style={styles.oauthLine} />
          <Text style={styles.oauthDividerText}>или</Text>
          <View style={styles.oauthLine} />
        </View>

        <View style={styles.oauthStack}>
          <Pressable style={styles.oauthButton} onPress={() => onOAuth('google')} disabled={loading}>
            <Text style={styles.oauthButtonText}>Google</Text>
          </Pressable>
          <Pressable style={styles.oauthButton} onPress={() => onOAuth('apple')} disabled={loading}>
            <Text style={styles.oauthButtonText}>Apple ID</Text>
          </Pressable>
          <Pressable style={styles.oauthButton} onPress={() => onOAuth('yandex')} disabled={loading}>
            <Text style={styles.oauthButtonText}>Yandex</Text>
          </Pressable>
        </View>
        <Text style={styles.authFootnote}>
          Для кода в письме шаблон Supabase должен содержать OTP token. Yandex подключается как custom OAuth/OIDC provider.
        </Text>
      </View>
    </View>
  );
}
