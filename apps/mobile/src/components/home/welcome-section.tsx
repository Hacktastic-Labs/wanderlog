import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type Props = {
  greeting: string;
  firstName: string;
};

export function WelcomeSection({ greeting, firstName }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {greeting},{'\n'}
        <Text style={styles.name}>{firstName}</Text>
      </Text>
      <Text style={styles.subtitle}>Your travel dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginTop: 4,
  },
  greeting: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 40,
    color: '#ffffff',
  },
  name: {
    color: '#f4a261',
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: '#8e8e93',
    marginTop: 2,
  },
});
