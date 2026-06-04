import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/wanderlog/glass-card';
import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { CATEGORY_LABELS } from '@/constants/wanderlog';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { useVisitsStore } from '@/stores/visits.store';
import { formatDurationMinutes } from '@/utils/date';
import { buildCategoryDistribution, computeConsecutiveDayStreak } from '@/utils/stats';

export function StatsExplorePanel() {
  useVisitsQuery();
  const visits = useVisitsStore((state) => state.visits);

  const uniquePlaces = new Set(visits.map((visit) => `${visit.placeName}:${visit.latitude}:${visit.longitude}`)).size;
  const uniqueCities = new Set(visits.map((visit) => visit.city).filter(Boolean)).size;
  const uniqueCountries = new Set(visits.map((visit) => visit.country).filter(Boolean)).size;
  const totalMinutes = visits.reduce((sum, visit) => sum + visit.durationMinutes, 0);
  const avgDuration = visits.length ? Math.round(totalMinutes / visits.length) : 0;

  const categoryDistribution = buildCategoryDistribution(visits);
  const topCategoryCount = categoryDistribution[0]?.[1] ?? 1;

  const rankedPlaces = [...visits]
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
    .slice(0, 3)
    .map((visit) => visit.placeName);

  const streak = computeConsecutiveDayStreak(visits);
  const newPlacesThisMonth = new Set(
    visits
      .filter((visit) => {
        const date = new Date(visit.arrivedAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .map((visit) => visit.placeName),
  ).size;

  return (
    <ScreenContainer>
      <GlassCard>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.metric}>Total visits: {visits.length}</Text>
        <Text style={styles.metric}>Unique places: {uniquePlaces}</Text>
        <Text style={styles.metric}>Cities: {uniqueCities}</Text>
        <Text style={styles.metric}>Countries: {uniqueCountries}</Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Categories</Text>
        {categoryDistribution.map(([category, count]) => (
          <View key={category} style={styles.categoryRow}>
            <Text style={styles.metric}>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(count / topCategoryCount) * 100}%` }]} />
            </View>
            <Text style={styles.metric}>{count}</Text>
          </View>
        ))}
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Streaks</Text>
        <Text style={styles.metric}>Consecutive days exploring: {streak}</Text>
        <Text style={styles.metric}>New places this month: {newPlacesThisMonth}</Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Rankings</Text>
        <Text style={styles.metric}>Most time spent at:</Text>
        {rankedPlaces.map((place) => (
          <Text key={place} style={styles.rankItem}>
            {place}
          </Text>
        ))}
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Time Analysis</Text>
        <Text style={styles.metric}>Hours spent outside: {(totalMinutes / 60).toFixed(1)}h</Text>
        <Text style={styles.metric}>Average visit duration: {formatDurationMinutes(avgDuration)}</Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  metric: {
    color: '#334E68',
    fontSize: 14,
    marginBottom: 2,
  },
  categoryRow: {
    marginBottom: 8,
    gap: 4,
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#D9E2EC',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 999,
  },
  rankItem: {
    color: '#0E7490',
    fontWeight: '600',
    marginTop: 2,
  },
});
