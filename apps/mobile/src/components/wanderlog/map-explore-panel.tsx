import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { LifeReplay } from '@/components/wanderlog/life-replay';
import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { CATEGORY_LABELS } from '@/constants/wanderlog';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { getPlaceAggregates } from '@/services/api/visits.api';
import { useVisitsStore } from '@/stores/visits.store';
import { formatDateTime, formatDurationMinutes } from '@/utils/date';

const DATE_FILTERS = ['7d', '30d', 'all'] as const;
const APP_BOOT_TIME_MS = new Date().getTime();

export function MapExplorePanel() {
  const visits = useVisitsStore((state) => state.visits);
  const setFilters = useVisitsStore((state) => state.setFilters);

  const [dateFilter, setDateFilter] = useState<(typeof DATE_FILTERS)[number]>('all');
  const [countryFilter, setCountryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useVisitsQuery();

  const filteredVisits = useMemo(() => {
    let result = [...visits];

    if (dateFilter !== 'all') {
      const days = dateFilter === '7d' ? 7 : 30;
      const threshold = APP_BOOT_TIME_MS - days * 24 * 60 * 60 * 1000;
      result = result.filter((visit) => new Date(visit.arrivedAt).getTime() >= threshold);
    }
    if (countryFilter.trim()) {
      result = result.filter((visit) => (visit.country ?? '').toLowerCase().includes(countryFilter.toLowerCase()));
    }
    if (cityFilter.trim()) {
      result = result.filter((visit) => (visit.city ?? '').toLowerCase().includes(cityFilter.toLowerCase()));
    }

    return result;
  }, [cityFilter, countryFilter, dateFilter, visits]);

  const aggregates = useMemo(() => getPlaceAggregates(filteredVisits), [filteredVisits]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <View style={styles.filterRow}>
          {DATE_FILTERS.map((filter) => (
            <Pressable
              key={filter}
              style={[styles.chip, dateFilter === filter ? styles.chipActive : null]}
              onPress={() => {
                setDateFilter(filter);
                if (filter === 'all') {
                  setFilters({ startDate: undefined });
                }
              }}>
              <Text style={[styles.chipLabel, dateFilter === filter ? styles.chipLabelActive : null]}>{filter}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.textFilterRow}>
          <TextInput
            value={countryFilter}
            onChangeText={setCountryFilter}
            placeholder="Country"
            style={styles.textFilter}
          />
          <TextInput value={cityFilter} onChangeText={setCityFilter} placeholder="City" style={styles.textFilter} />
        </View>
      </View>

      <FlatList
        data={aggregates}
        keyExtractor={(place) => place.key}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No places match your filters.</Text>}
        renderItem={({ item: place }) => (
          <View style={styles.placeCard}>
            <Text style={styles.placeTitle}>{place.placeName}</Text>
            <Text style={styles.placeMeta}>{CATEGORY_LABELS[place.category]}</Text>
            <Text style={styles.placeMeta}>Visits: {place.visitCount}</Text>
            <Text style={styles.placeMeta}>Last visited: {formatDateTime(place.lastVisitedAt)}</Text>
            <Text style={styles.placeMeta}>Total time: {formatDurationMinutes(place.totalMinutes)}</Text>
          </View>
        )}
      />

      <View style={styles.replayWrap}>
        <LifeReplay
          frames={filteredVisits
            .map((visit) => ({
              timestamp: visit.arrivedAt,
              latitude: visit.latitude,
              longitude: visit.longitude,
              placeName: visit.placeName,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BCCCDC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },
  chipLabel: {
    color: '#334E68',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '700',
  },
  chipLabelActive: {
    color: '#F0F4F8',
  },
  textFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  textFilter: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  placeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    backgroundColor: '#FFFFFF',
    padding: 12,
    gap: 2,
  },
  placeTitle: {
    fontWeight: '700',
    color: '#102A43',
  },
  placeMeta: {
    color: '#334E68',
    fontSize: 12,
  },
  empty: {
    color: '#627D98',
    textAlign: 'center',
    marginTop: 24,
  },
  replayWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
