import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function ScreenShell({
  children,
  onBack,
  title,
}: {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.flowHeader}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <Text style={styles.flowTitle}>{title}</Text>
        <View style={styles.backButtonGhost} />
      </View>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 118,
  },
  flowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
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
  flowTitle: {
    color: '#17233a',
    fontSize: 17,
    fontWeight: '800',
  },
});
