import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const pinKey = 'reflecta:privacy-pin';

export type PrivacyLockController = ReturnType<typeof usePrivacyLock>;

export function usePrivacyLock(enabled: boolean) {
  const [locked, setLocked] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    void Promise.all([
      AsyncStorage.getItem(pinKey),
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ])
      .then(([storedPin, hasHardware, isEnrolled]) => {
        const hasPin = Boolean(storedPin);

        setBiometricAvailable(hasHardware && isEnrolled);
        setPinEnabled(hasPin);
        setLocked(enabled && hasPin);
      })
      .finally(() => setReady(true));
  }, [enabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasActive = appState.current === 'active';

      appState.current = nextState;

      if (!enabled || !pinEnabled || !ready) {
        return;
      }

      if (wasActive && (nextState === 'background' || nextState === 'inactive')) {
        setLocked(true);
      }
    });

    return () => subscription.remove();
  }, [enabled, pinEnabled, ready]);

  const enablePin = async (pin: string) => {
    const normalizedPin = normalizePin(pin);

    if (!isValidPin(normalizedPin)) {
      return false;
    }

    await AsyncStorage.setItem(pinKey, normalizedPin);
    setPinEnabled(true);
    setLocked(false);

    return true;
  };

  const disablePin = async () => {
    await AsyncStorage.removeItem(pinKey);
    setPinEnabled(false);
    setLocked(false);
  };

  const unlock = async (pin: string) => {
    const storedPin = await AsyncStorage.getItem(pinKey);

    if (storedPin && storedPin === normalizePin(pin)) {
      setLocked(false);
      return true;
    }

    return false;
  };

  const unlockWithBiometrics = async () => {
    if (!biometricAvailable || !pinEnabled) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      disableDeviceFallback: false,
      promptMessage: 'Unlock Reflecta',
    });

    if (result.success) {
      setLocked(false);
      return true;
    }

    return false;
  };

  const lock = () => {
    if (pinEnabled) {
      setLocked(true);
    }
  };

  return {
    disablePin,
    enablePin,
    biometricAvailable,
    lock,
    locked,
    pinEnabled,
    ready,
    unlock,
    unlockWithBiometrics,
  };
}

function normalizePin(pin: string) {
  return pin.replace(/\D/g, '').slice(0, 6);
}

function isValidPin(pin: string) {
  return pin.length >= 4 && pin.length <= 6;
}
