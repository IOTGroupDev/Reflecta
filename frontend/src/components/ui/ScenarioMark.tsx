import { StyleSheet, Text, View } from 'react-native';
import type { Scenario } from '../../types';

export function ScenarioMark({ scenario }: { scenario: Scenario }) {
  return (
    <View style={[styles.mark, { backgroundColor: scenario.color }]}>
      <Text style={styles.text}>{scenario.icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    borderRadius: 18,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
});
