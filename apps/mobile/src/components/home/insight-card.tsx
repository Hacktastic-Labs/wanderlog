import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import type { DashboardInsight } from '@/hooks/use-home-dashboard';

type Props = {
  insight: DashboardInsight;
};

export function InsightCard({ insight }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{insight.emoji}</Text>
      <Text style={styles.title}>{insight.title}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {insight.value}
      </Text>
      {insight.subtitle ? (
        <Text style={styles.subtitle}>{insight.subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    gap: 6,
    marginRight: 10,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  title: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 20,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#f4a261',
  },
});
