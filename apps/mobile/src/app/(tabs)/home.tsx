import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { Fonts } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Home</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: '#ffffff',
  },
});
