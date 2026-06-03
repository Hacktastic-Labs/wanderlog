import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/wanderlog/glass-card';
import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { StatPill } from '@/components/wanderlog/stat-pill';
import { VisitCard } from '@/components/wanderlog/visit-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useLocationTracking } from '@/hooks/use-location-tracking';
import { useManualCheckIn } from '@/hooks/use-manual-checkin';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { useAuthStore } from '@/stores/auth.store';
import { useTrackingStore } from '@/stores/tracking.store';
import { useVisitsStore } from '@/stores/visits.store';

export default function HomeScreen() {
  const profile = useAuthStore((state) => state.profile);
  const visits = useVisitsStore((state) => state.visits);
  const isForegroundTrackingActive = useTrackingStore((state) => state.isForegroundTrackingActive);

  const { startTracking, stopTracking } = useLocationTracking();
  const { createManualCheckIn } = useManualCheckIn();

  useVisitsQuery();
  const dashboard = useDashboardData();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    }
    if (hour < 18) {
      return 'Good Afternoon';
    }
    return 'Good Evening';
  };

  return (
    <ScreenContainer>
      <GlassCard style={styles.hero}>
        <Text style={styles.welcome}>{`${greeting()}, ${profile?.name ?? 'Explorer'}`}</Text>
        <Text style={styles.subtitle}>Your life map is private, searchable, and always yours.</Text>

        <View style={styles.badgePill}>
          <Text style={styles.badge}>Private timeline</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.cta}
            onPress={async () => {
              try {
                await createManualCheckIn(30);
                Alert.alert('Visit logged', 'Your manual check-in was saved.');
              } catch (error) {
                Alert.alert('Check-in failed', error instanceof Error ? error.message : 'Try again.');
              }
            }}>
            <Text style={styles.ctaLabel}>Log Manual Check-in</Text>
          </Pressable>

          <Pressable
            style={[styles.toggle, isForegroundTrackingActive ? styles.toggleActive : null]}
            onPress={() => {
              if (isForegroundTrackingActive) {
                stopTracking();
              } else {
                startTracking();
              }
            }}>
            <Text style={styles.toggleLabel}>{isForegroundTrackingActive ? 'Tracking On' : 'Tracking Off'}</Text>
          </Pressable>
        </View>
      </GlassCard>

      <View style={styles.statsRow}>
        <StatPill label="Total Places" value={dashboard.totalPlaces} />
        <StatPill label="Cities" value={dashboard.cities} />
      </View>
      <View style={styles.statsRow}>
        <StatPill label="Countries" value={dashboard.countries} />
        <StatPill label="This Month" value={dashboard.placesThisMonth} />
      </View>

      <GlassCard>
        <Text style={styles.sectionTitle}>Explore Insights</Text>
        <Text style={styles.insight}>Most visited: {dashboard.mostVisitedPlace}</Text>
        <Text style={styles.insight}>Longest stay: {dashboard.longestStay}</Text>
        <Text style={styles.insight}>New place this week: {dashboard.newPlaceThisWeek}</Text>
        <Text style={styles.insight}>Favorite area: {dashboard.favoriteArea}</Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Recent Visits</Text>
        {visits.slice(0, 5).map((visit) => (
          <VisitCard key={visit.id} visit={visit} />
        ))}
        {!visits.length && <Text style={styles.empty}>No visits yet. Start with a manual check-in.</Text>}
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#102A43',
    borderColor: '#334E68',
  },
  welcome: {
    color: '#F0F4F8',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#D9E2EC',
    fontSize: 14,
  },
  badgePill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(8, 145, 178, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badge: {
    color: '#D1FAE5',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  cta: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaLabel: {
    color: '#F0F4F8',
    fontWeight: '700',
  },
  toggle: {
    backgroundColor: '#334E68',
    borderRadius: 12,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  toggleActive: {
    backgroundColor: '#126170',
  },
  toggleLabel: {
    color: '#F0F4F8',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 6,
  },
  insight: {
    color: '#334E68',
    fontSize: 14,
    marginBottom: 2,
  },
  empty: {
    color: '#627D98',
    marginTop: 6,
  },
});
