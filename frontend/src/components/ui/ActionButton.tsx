import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export function PrimaryButton({
  compact,
  disabled,
  label,
  loading,
  onPress,
}: {
  compact?: boolean;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={compact ? localStyles.primaryCompact : localStyles.primary}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={localStyles.primaryText}>{label}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  wide,
}: {
  label: string;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable style={wide ? localStyles.secondaryWide : localStyles.secondary} onPress={onPress}>
      <Text style={localStyles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  primary: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 22,
    marginTop: 20,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryCompact: {
    alignItems: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 20,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondary: {
    alignItems: 'center',
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 20,
    flex: 1,
    minHeight: 54,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryWide: {
    alignItems: 'center',
    backgroundColor: '#e5edf8',
    borderRadius: 20,
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 52,
  },
  secondaryText: {
    color: '#17233a',
    fontSize: 15,
    fontWeight: '800',
  },
});
