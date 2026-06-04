import { Redirect, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { AUTH_ENABLED } from '@/constants/features';
import { useAuthStore } from '@/stores/auth.store';

const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: '#0E7490',
  tabBarInactiveTintColor: '#829AB1',
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D9E2EC',
  },
} as const;

export default function TabsLayout() {
  const session = useAuthStore((state) => state.session);

  if (AUTH_ENABLED && !session?.user.id) {
    return <Redirect href="/(auth)/login" />;
  }

  if (Platform.OS === 'web') {
    return (
      <Tabs screenOptions={tabScreenOptions}>
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      tintColor="#0E7490"
      labelStyle={{
        default: { color: '#829AB1' },
        selected: { color: '#0E7490' },
      }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="explore" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.circle', selected: 'person.circle.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
