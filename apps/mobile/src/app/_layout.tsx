import '@/services/location/location-task.registry';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useBootstrap } from '@/hooks/use-bootstrap';
import { useSyncPendingCheckIns } from '@/hooks/use-sync-pending-checkins';
import { queryClient } from '@/lib/query-client';

export default function RootLayout() {
  useBootstrap();
  useSyncPendingCheckIns();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
