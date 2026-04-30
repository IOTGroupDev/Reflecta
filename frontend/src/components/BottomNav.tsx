import { Pressable, Text, View } from 'react-native';
import { styles } from '../theme/styles';

type Tab = 'today' | 'chat' | 'practices' | 'journal' | 'insights';

export function BottomNav({
  activeTab,
  onChange,
  onHome,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  onHome: () => void;
}) {
  const changeTab = (tab: Tab) => {
    if (tab === 'today') {
      onHome();
    }

    onChange(tab);
  };

  return (
    <View style={styles.bottomNav}>
      {[
        ['today', 'Дом'],
        ['chat', 'Чат'],
        ['practices', 'Практики'],
        ['journal', 'Дневник'],
        ['insights', 'Итоги'],
      ].map(([tab, label]) => {
        const active = activeTab === tab;

        return (
          <Pressable
            key={tab}
            style={[styles.navItem, active && styles.navItemActive]}
            onPress={() => changeTab(tab as Tab)}
          >
            <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
