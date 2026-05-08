import { Pressable, StyleSheet, Text, View } from 'react-native';

export function PageHeader({
  onBack,
  subtitle,
  title,
}: {
  onBack?: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <>
      <View style={styles.headerRow}>
        {onBack ? (
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
        ) : null}
        <Text style={[styles.pageTitle, onBack && styles.pageTitleWithBack]}>{title}</Text>
        {onBack ? <View style={styles.backButtonGhost} /> : null}
      </View>
      <Text style={styles.pageSubtitle}>{subtitle}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(247,251,255,0.72)',
    borderRadius: 20,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backButtonGhost: {
    height: 44,
    width: 44,
  },
  backButtonText: {
    color: '#17233a',
    fontSize: 34,
    lineHeight: 36,
  },
  pageTitle: {
    color: '#17233a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pageTitleWithBack: {
    flex: 1,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
  },
  pageSubtitle: {
    color: '#65748c',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 8,
  },
});
