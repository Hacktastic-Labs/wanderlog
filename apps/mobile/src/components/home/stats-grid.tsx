import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import type { DashboardStats } from '@/hooks/use-home-dashboard';

type Props = {
  stats: DashboardStats;
};

const STAT_ITEMS: {
  key: keyof DashboardStats;
  label: string;
  emoji: string;
}[] = [
  { key: 'totalPlacesVisited', label: 'Places Visited', emoji: '📍' },
  { key: 'citiesVisited', label: 'Cities', emoji: '🏙️' },
  { key: 'countriesVisited', label: 'Countries', emoji: '🌍' },
  { key: 'placesThisMonth', label: 'This Month', emoji: '📅' },
];

export function StatsGrid({ stats }: Props) {
  return (
    <View style={styles.grid}>
      {STAT_ITEMS.map((item) => (
        <View key={item.key} style={styles.card}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.value}>{stats[item.key]}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    gap: 4,
    minWidth: '47%',
  },
  emoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  value: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 26,
    color: '#ffffff',
    lineHeight: 30,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#8e8e93',
  },
});
