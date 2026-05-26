import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, useColorScheme, View, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Civic Map</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Leaderboard</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const palette = {
    activeBg: '#FF6F00',
    activeText: '#ffffff',
    inactiveText: isDark ? '#92E5EC' : '#64748b',
    inactiveBg: 'transparent',
  };

  return (
    <Pressable {...props} style={styles.tabPressable}>
      <View
        style={[
          styles.tabButtonView,
          {
            backgroundColor: isFocused ? palette.activeBg : palette.inactiveBg,
          }
        ]}
      >
        <Text
          style={[
            styles.tabButtonText,
            {
              color: isFocused ? palette.activeText : palette.inactiveText,
              fontWeight: isFocused ? 'bold' : '600',
            }
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const listColors = {
    bg: isDark ? 'rgba(0, 15, 8, 0.7)' : 'rgba(244, 255, 254, 0.72)',
    border: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
  };

  return (
    <View {...props} style={styles.tabListContainer}>
      <View 
        style={[
          styles.innerContainer, 
          { 
            backgroundColor: listColors.bg, 
            borderColor: listColors.border 
          }
        ]}
      >
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 24, // Floating at the bottom
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 32, // Beautiful rounded capsule
    borderWidth: 1,
    width: '90%',
    maxWidth: 360,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 10,
    // Web glassmorphism
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px) saturate(210%)',
        WebkitBackdropFilter: 'blur(30px) saturate(210%)',
      } as any,
    }),
  },
  tabPressable: {
    flex: 1,
    marginHorizontal: 3,
  },
  tabButtonView: {
    paddingVertical: 12,
    borderRadius: 26, // Perfect internal pill shape
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonText: {
    fontSize: 13.5,
    letterSpacing: 0.3,
  },
});
