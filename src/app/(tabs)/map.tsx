import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Callout, Circle, Marker } from 'react-native-maps';

import { LifeReplay } from '@/components/wanderlog/life-replay';
import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { CATEGORY_LABELS } from '@/constants/wanderlog';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { getPlaceAggregates } from '@/services/api/visits.api';
import { useVisitsStore } from '@/stores/visits.store';
import { formatDateTime, formatDurationMinutes } from '@/utils/date';
import { getMapRegionDelta } from '@/utils/geo';

const DATE_FILTERS = ['7d', '30d', 'all'] as const;
const APP_BOOT_TIME_MS = new Date().getTime();

export default function MapScreen() {
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

  const initialRegion = useMemo(() => {
    const first = aggregates[0] ?? filteredVisits[0];
    if (!first) {
      return {
        latitude: 20.5937,
        longitude: 78.9629,
        ...getMapRegionDelta(2),
      };
    }

    return {
      latitude: first.latitude,
      longitude: first.longitude,
      ...getMapRegionDelta(8),
    };
  }, [aggregates, filteredVisits]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
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

      <View style={styles.mapWrap}>
        <MapView style={styles.map} initialRegion={initialRegion} clusterColor="#0E7490" animationEnabled>
          {aggregates.map((place) => (
            <Marker key={place.key} coordinate={{ latitude: place.latitude, longitude: place.longitude }}>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{place.placeName}</Text>
                  <Text style={styles.calloutMeta}>{CATEGORY_LABELS[place.category]}</Text>
                  <Text style={styles.calloutMeta}>Visits: {place.visitCount}</Text>
                  <Text style={styles.calloutMeta}>Last visited: {formatDateTime(place.lastVisitedAt)}</Text>
                  <Text style={styles.calloutMeta}>Total time: {formatDurationMinutes(place.totalMinutes)}</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {aggregates.map((place) => (
            <Circle
              key={`${place.key}-heat`}
              center={{ latitude: place.latitude, longitude: place.longitude }}
              radius={Math.min(1200, 120 + place.visitCount * 80)}
              fillColor={`rgba(14, 116, 144, ${Math.min(0.42, 0.08 + place.visitCount * 0.04)})`}
              strokeColor="rgba(14, 116, 144, 0.15)"
            />
          ))}
        </MapView>
      </View>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#102A43',
    paddingHorizontal: 16,
    paddingTop: 8,
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
  mapWrap: {
    flex: 1,
    borderRadius: 22,
    margin: 16,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  map: {
    flex: 1,
  },
  callout: {
    minWidth: 180,
    gap: 2,
  },
  calloutTitle: {
    fontWeight: '700',
    color: '#102A43',
  },
  calloutMeta: {
    color: '#334E68',
    fontSize: 12,
  },
});
