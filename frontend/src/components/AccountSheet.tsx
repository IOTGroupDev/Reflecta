import { Pressable, Text, View } from 'react-native';
import { styles } from '../theme/styles';
import { SecondaryButton } from './ui/ActionButton';

export function AccountSheet({
  email,
  onClose,
  onSignOut,
}: {
  email: string;
  onClose: () => void;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.sheetOverlay}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.accountSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.panelTitle}>Аккаунт</Text>
        <Text style={styles.panelText}>{email}</Text>
        <View style={styles.accountNote}>
          <Text style={styles.accountNoteText}>
            Дневник, чат и итоги сохраняются в Supabase под твоим Auth UUID.
          </Text>
        </View>
        <SecondaryButton wide label="Закрыть" onPress={onClose} />
        <Pressable style={styles.dangerButton} onPress={onSignOut}>
          <Text style={styles.dangerButtonText}>Выйти</Text>
        </Pressable>
      </View>
    </View>
  );
}
