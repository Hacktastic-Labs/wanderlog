import { Redirect, Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { AUTH_ENABLED } from '@/constants/features';
import { useAuthStore } from '@/stores/auth.store';

const tabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarActiveTintColor: '#ffffff',
  tabBarInactiveTintColor: '#8e8e93',
  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopColor: '#333333',
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
        <Tabs.Screen name="home" options={{ title: '' }} />
        <Tabs.Screen name="explore" options={{ title: '' }} />
        <Tabs.Screen name="profile" options={{ title: '' }} />
      </Tabs>
    );
  }

  return (
    <NativeTabs
      tintColor="#ffffff"
      backgroundColor="#000000"
      indicatorColor="#333333">
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label hidden>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} md="explore" />
        <NativeTabs.Trigger.Label hidden>Explore</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.circle', selected: 'person.circle.fill' }}
          md="person"
        />
        <NativeTabs.Trigger.Label hidden>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
