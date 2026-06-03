import { useMemo } from 'react';

import { useVisitsStore } from '@/stores/visits.store';

const APP_BOOT_TIME_MS = new Date().getTime();

export const useDashboardData = () => {
  const visits = useVisitsStore((state) => state.visits);

  return useMemo(() => {
    const thisMonth = new Date();
    const monthVisits = visits.filter((visit) => {
      const date = new Date(visit.arrivedAt);
      return date.getMonth() === thisMonth.getMonth() && date.getFullYear() === thisMonth.getFullYear();
    });

    const citySet = new Set(visits.map((visit) => visit.city).filter(Boolean));
    const countrySet = new Set(visits.map((visit) => visit.country).filter(Boolean));

    const groupedByPlace = new Map<string, { count: number; totalMinutes: number; latest: string }>();
    for (const visit of visits) {
      const key = visit.placeName;
      const existing = groupedByPlace.get(key) ?? { count: 0, totalMinutes: 0, latest: visit.arrivedAt };
      existing.count += 1;
      existing.totalMinutes += visit.durationMinutes;
      if (new Date(visit.arrivedAt) > new Date(existing.latest)) {
        existing.latest = visit.arrivedAt;
      }
      groupedByPlace.set(key, existing);
    }

    const sortedPlaces = [...groupedByPlace.entries()].sort((a, b) => b[1].count - a[1].count);
    const sortedByDuration = [...groupedByPlace.entries()].sort(
      (a, b) => b[1].totalMinutes - a[1].totalMinutes,
    );

    const mostVisitedPlace = sortedPlaces[0]?.[0] ?? 'No data yet';
    const longestStay = sortedByDuration[0]?.[0] ?? 'No data yet';

    return {
      totalPlaces: groupedByPlace.size,
      cities: citySet.size,
      countries: countrySet.size,
      placesThisMonth: monthVisits.length,
      mostVisitedPlace,
      longestStay,
      newPlaceThisWeek:
        visits.find(
          (visit) =>
            APP_BOOT_TIME_MS - new Date(visit.arrivedAt).getTime() < 7 * 24 * 60 * 60 * 1000,
        )?.placeName ?? 'No new place this week',
      favoriteArea: sortedPlaces[0]?.[0] ?? 'Explore to unlock',
    };
  }, [visits]);
};
