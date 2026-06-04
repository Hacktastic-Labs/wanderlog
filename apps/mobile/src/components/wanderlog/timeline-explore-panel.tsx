import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/wanderlog/screen-container';
import { SearchInput } from '@/components/wanderlog/search-input';
import { VisitCard } from '@/components/wanderlog/visit-card';
import { useVisitsQuery } from '@/hooks/use-visits-query';
import { useVisitsStore } from '@/stores/visits.store';
import { getDayKey, getMonthKey } from '@/utils/date';

export function TimelineExplorePanel() {
  const [query, setQuery] = useState('');

  useVisitsQuery();
  const visits = useVisitsStore((state) => state.visits);

  const grouped = useMemo(() => {
    const filtered = visits.filter((visit) =>
      [visit.placeName, visit.city, visit.country, visit.category].some((value) =>
        (value ?? '').toLowerCase().includes(query.toLowerCase()),
      ),
    );

    const monthMap = new Map<string, Map<string, typeof filtered>>();
    for (const visit of filtered) {
      const month = getMonthKey(visit.arrivedAt);
      const day = getDayKey(visit.arrivedAt);

      if (!monthMap.has(month)) {
        monthMap.set(month, new Map());
      }
      const dayMap = monthMap.get(month)!;
      if (!dayMap.has(day)) {
        dayMap.set(day, []);
      }
      dayMap.get(day)!.push(visit);
    }

    return [...monthMap.entries()];
  }, [query, visits]);

  return (
    <ScreenContainer>
      <SearchInput value={query} onChangeText={setQuery} placeholder="Search place, city, country, category" />

      {grouped.map(([month, days]) => (
        <View key={month} style={styles.monthSection}>
          <Text style={styles.month}>{month}</Text>
          {[...days.entries()].map(([day, dayVisits]) => (
            <View key={day} style={styles.daySection}>
              <Text style={styles.day}>{day}</Text>
              {dayVisits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </View>
          ))}
        </View>
      ))}

      {!grouped.length && <Text style={styles.empty}>No timeline entries found.</Text>}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  monthSection: {
    gap: 8,
  },
  month: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#334E68',
  },
  daySection: {
    gap: 6,
  },
  day: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#627D98',
  },
  empty: {
    color: '#627D98',
    textAlign: 'center',
    marginTop: 40,
  },
});
