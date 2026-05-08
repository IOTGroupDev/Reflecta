import { Pressable, StyleSheet, Text, View } from 'react-native';
import { copy } from '../i18n';
import type { Language, Tab } from '../types';

const tabIcons: Record<Tab, string> = {
  today: '⌂',
  chat: '◔',
  practices: '✦',
  journal: '▤',
  insights: '⌁',
  profile: '●',
};

export function BottomNav({
  activeTab,
  language,
  onChange,
  onHome,
}: {
  activeTab: Tab;
  language: Language;
  onChange: (tab: Tab) => void;
  onHome: () => void;
}) {
  const t = copy[language];
  const changeTab = (tab: Tab) => {
    if (tab === 'today') {
      onHome();
    }

    onChange(tab);
  };

  return (
    <View style={styles.bottomNav}>
      {([
        'today',
        'chat',
        'practices',
        'journal',
        'insights',
        'profile',
      ] as Tab[]).map((tab) => {
        const active = activeTab === tab;

        return (
          <Pressable
            key={tab}
            style={[styles.navItem, active && styles.navItemActive]}
            onPress={() => changeTab(tab)}
          >
            <Text style={[styles.navIcon, active && styles.navIconActive]}>
              {tabIcons[tab]}
            </Text>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              numberOfLines={1}
              style={[styles.navText, active && styles.navTextActive]}
            >
              {t.nav[tab]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    alignSelf: 'center',
    backgroundColor: '#1976ee',
    borderRadius: 34,
    bottom: 22,
    flexDirection: 'row',
    gap: 3,
    padding: 6,
    position: 'absolute',
    boxShadow: '0 14px 24px rgba(35,111,199,0.26)',
    maxWidth: 414,
    width: '94%',
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 26,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  navItemActive: {
    backgroundColor: '#ffffff',
  },
  navText: {
    color: '#d8e8ff',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  navTextActive: {
    color: '#17233a',
  },
  navIcon: {
    color: '#d8e8ff',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 18,
  },
  navIconActive: {
    color: '#1976ee',
  },
});
