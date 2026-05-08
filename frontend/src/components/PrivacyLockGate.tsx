import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { copy } from '../i18n';
import type { Language } from '../types';

export function PrivacyLockGate({
  biometricAvailable,
  language,
  onBiometricUnlock,
  onUnlock,
}: {
  biometricAvailable: boolean;
  language: Language;
  onBiometricUnlock: () => Promise<boolean>;
  onUnlock: (pin: string) => Promise<boolean>;
}) {
  const t = copy[language];
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  const submit = () => {
    void onUnlock(pin).then((unlocked) => {
      if (unlocked) {
        setPin('');
        setMessage('');
        return;
      }

      setMessage(t.privacyLock.wrongPin);
    });
  };

  const submitBiometric = () => {
    void onBiometricUnlock().then((unlocked) => {
      if (!unlocked) {
        setMessage(t.privacyLock.wrongPin);
      }
    });
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.panel}>
        <Text style={styles.title}>{t.privacyLock.title}</Text>
        <Text style={styles.text}>{t.privacyLock.text}</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setPin}
          onSubmitEditing={submit}
          placeholder={t.privacyLock.placeholder}
          placeholderTextColor="#8a97aa"
          secureTextEntry
          style={styles.input}
          value={pin}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>{t.privacyLock.unlock}</Text>
        </Pressable>
        {biometricAvailable ? (
          <Pressable style={styles.secondaryButton} onPress={submitBiometric}>
            <Text style={styles.secondaryButtonText}>{t.privacyLock.unlockBiometric}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: '#111827',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 22,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 30,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 22,
    width: '100%',
  },
  title: {
    color: '#17233a',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  text: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#edf2f7',
    borderRadius: 18,
    color: '#17233a',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 18,
    minHeight: 54,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  message: {
    color: '#be123c',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#d7ff7a',
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 52,
  },
  buttonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#d7e5f6',
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 48,
  },
  secondaryButtonText: {
    color: '#17233a',
    fontSize: 14,
    fontWeight: '900',
  },
});
