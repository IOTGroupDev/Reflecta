import { Pressable, Text, View } from 'react-native';
import { styles } from '../theme/styles';
import { PrimaryButton } from './ui/ActionButton';

export function SafetySheet({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.accountSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.safetyTitle}>Сейчас нужна живая помощь</Text>
        <Text style={styles.panelText}>
          Если есть риск, что ты можешь причинить вред себе или кому-то ещё, не оставайся один.
        </Text>
        <View style={styles.safetySteps}>
          <Text style={styles.safetyStep}>1. Позови человека рядом или напиши близкому: “мне сейчас небезопасно, побудь со мной”.</Text>
          <Text style={styles.safetyStep}>2. Убери от себя всё, чем можно навредить.</Text>
          <Text style={styles.safetyStep}>3. Если опасность уже рядом, обратись в местные экстренные службы.</Text>
        </View>
        <Text style={styles.safetyNote}>
          Reflecta может поддержать текстом, но не заменяет срочную помощь и очную поддержку.
        </Text>
        <PrimaryButton label="Я понял" onPress={onClose} />
      </View>
    </View>
  );
}
