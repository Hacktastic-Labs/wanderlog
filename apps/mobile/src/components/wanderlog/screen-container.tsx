import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
}>;

export const ScreenContainer = ({ children, scroll = true }: Props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contentStyle = {
    paddingHorizontal: 16,
    paddingBottom: insets.bottom + 28,
    paddingTop: 8,
    gap: 12,
  };

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={contentStyle}
          contentInsetAdjustmentBehavior="automatic"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={contentStyle}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
