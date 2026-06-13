import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { AUTH_ENABLED } from '@/constants/features';
import { AuthColors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth.store';

export default function IndexRoute() {
  const session = useAuthStore((state) => state.session);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: AuthColors.background,
        }}
      >
        <ActivityIndicator size="large" color={AuthColors.foreground} />
      </View>
    );
  }

  if (!AUTH_ENABLED || session?.user.id) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
