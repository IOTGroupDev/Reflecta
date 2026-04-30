import { StyleSheet, Text, View } from 'react-native';

export function InsightMetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(247,251,255,0.78)',
    borderRadius: 24,
    flex: 1,
    minHeight: 118,
    padding: 18,
  },
  label: {
    color: '#728098',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  value: {
    color: '#17233a',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
