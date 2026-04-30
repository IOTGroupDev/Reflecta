import { StyleSheet, Text } from 'react-native';

export function PageHeader({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.pageSubtitle}>{subtitle}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: '#17233a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pageSubtitle: {
    color: '#65748c',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    marginTop: 8,
  },
});
