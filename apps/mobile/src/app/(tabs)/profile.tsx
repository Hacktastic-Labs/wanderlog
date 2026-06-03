import { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { GlassCard } from '@/components/wanderlog/glass-card';
import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import { useTrackingStore } from '@/stores/tracking.store';
import { useVisitsStore } from '@/stores/visits.store';

export default function ProfileScreen() {
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  const pauseTracking = useTrackingStore((state) => state.pauseTracking);
  const setPauseTracking = useTrackingStore((state) => state.setPauseTracking);
  const disableBackgroundTracking = useTrackingStore((state) => state.disableBackgroundTracking);
  const setDisableBackgroundTracking = useTrackingStore((state) => state.setDisableBackgroundTracking);

  const visits = useVisitsStore((state) => state.visits);

  useVisitsQuery();

  const summary = useMemo(() => {
    const cities = new Set(visits.map((visit) => visit.city).filter(Boolean)).size;
    const countries = new Set(visits.map((visit) => visit.country).filter(Boolean)).size;

    return {
      visits: visits.length,
      cities,
      countries,
    };
  }, [visits]);

  const exportData = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile,
      visits,
    };
    Alert.alert('Export prepared', JSON.stringify(payload).slice(0, 500) + '...');
  };

  const deleteAllData = async () => {
    if (!profile?.id) {
      return;
    }

    const supabase = getSupabaseClient();
    await supabase.from('location_points').delete().eq('user_id', profile.id);
    await supabase.from('visits').delete().eq('user_id', profile.id);
    Alert.alert('Data deleted', 'All location history has been removed.');
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Profile</Text>

      <GlassCard>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(profile?.name ?? 'W').charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.name}>{profile?.name ?? 'Explorer'}</Text>
            <Text style={styles.email}>{profile?.email ?? 'No email'}</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Statistics Summary</Text>
        <Text style={styles.metric}>Total visits: {summary.visits}</Text>
        <Text style={styles.metric}>Cities: {summary.cities}</Text>
        <Text style={styles.metric}>Countries: {summary.countries}</Text>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Privacy Controls</Text>
        <View style={styles.row}>
          <Text style={styles.metric}>Pause Tracking</Text>
          <Switch value={pauseTracking} onValueChange={setPauseTracking} />
        </View>
        <View style={styles.row}>
          <Text style={styles.metric}>Disable Background Tracking</Text>
          <Switch value={disableBackgroundTracking} onValueChange={setDisableBackgroundTracking} />
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={styles.sectionTitle}>Data & Account</Text>
        <Pressable style={styles.button} onPress={exportData}>
          <Text style={styles.buttonLabel}>Export Data</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.danger]} onPress={deleteAllData}>
          <Text style={styles.dangerLabel}>Delete All Data</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={signOut}>
          <Text style={styles.buttonLabel}>Logout</Text>
        </Pressable>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#102A43',
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#102A43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#F0F4F8',
    fontSize: 24,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#102A43',
  },
  email: {
    color: '#486581',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  metric: {
    color: '#334E68',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonLabel: {
    color: '#102A43',
    fontWeight: '700',
  },
  danger: {
    borderColor: '#F8B4B4',
    backgroundColor: '#FFF5F5',
  },
  dangerLabel: {
    color: '#C53030',
    fontWeight: '700',
  },
});
