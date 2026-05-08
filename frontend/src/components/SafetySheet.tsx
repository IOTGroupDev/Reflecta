import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './ui/ActionButton';
import { copy } from '../i18n';
import type { Language } from '../types';

export function SafetySheet({ language, onClose }: { language: Language; onClose: () => void }) {
  const t = copy[language];

  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.accountSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.safetyTitle}>{t.safety.title}</Text>
        <Text style={styles.panelText}>{t.safety.text}</Text>
        <View style={styles.safetySteps}>
          <Text style={styles.safetyStep}>{t.safety.step1}</Text>
          <Text style={styles.safetyStep}>{t.safety.step2}</Text>
          <Text style={styles.safetyStep}>{t.safety.step3}</Text>
        </View>
        <Text style={styles.safetyNote}>{t.safety.note}</Text>
        <PrimaryButton label={t.safety.understood} onPress={onClose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 30,
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(23,35,58,0.24)',
    flex: 1,
  },
  accountSheet: {
    backgroundColor: '#f7fbff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    bottom: 0,
    left: 0,
    padding: 22,
    paddingBottom: 34,
    position: 'absolute',
    right: 0,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: '#c8d7ea',
    borderRadius: 3,
    height: 5,
    marginBottom: 18,
    width: 46,
  },
  safetyTitle: {
    color: '#9f3d21',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
  },
  panelText: {
    color: '#63728a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  safetySteps: {
    backgroundColor: '#fff2ed',
    borderRadius: 20,
    gap: 10,
    marginTop: 16,
    padding: 16,
  },
  safetyStep: {
    color: '#5f453c',
    fontSize: 14,
    lineHeight: 21,
  },
  safetyNote: {
    color: '#7a584d',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
});
