import { useVisitsStore } from '@/stores/visits.store';
import type { PlaceAggregate, Visit, VisitDraft, VisitFilters } from '@/types/domain';
import { createLocalId } from '@/utils/id';

const applyVisitFilters = (visits: Visit[], filters?: VisitFilters) => {
  let result = [...visits];

  if (filters?.category && filters.category !== 'all') {
    result = result.filter((visit) => visit.category === filters.category);
  }
  if (filters?.city) {
    result = result.filter((visit) => (visit.city ?? '').toLowerCase().includes(filters.city!.toLowerCase()));
  }
  if (filters?.country) {
    result = result.filter((visit) =>
      (visit.country ?? '').toLowerCase().includes(filters.country!.toLowerCase()),
    );
  }
  if (filters?.startDate) {
    result = result.filter((visit) => visit.arrivedAt >= filters.startDate!);
  }
  if (filters?.endDate) {
    result = result.filter((visit) => visit.arrivedAt <= filters.endDate!);
  }
  if (filters?.query) {
    const lower = filters.query.toLowerCase();
    result = result.filter((visit) =>
      [visit.placeName, visit.city, visit.country, visit.category].some((value) =>
        (value ?? '').toLowerCase().includes(lower),
      ),
    );
  }

  return result.sort((a, b) => new Date(b.arrivedAt).getTime() - new Date(a.arrivedAt).getTime());
};

export const createVisit = async (draft: VisitDraft) => {
  const visit: Visit = {
    id: createLocalId('visit'),
    createdAt: new Date().toISOString(),
    ...draft,
  };

  useVisitsStore.setState((state) => ({
    visits: [visit, ...state.visits],
  }));

  return visit;
};

export const getVisits = async (userId: string, filters?: VisitFilters) => {
  const visits = useVisitsStore.getState().visits.filter((visit) => visit.userId === userId);
  return applyVisitFilters(visits, filters);
};

export const getPlaceAggregates = (visits: Visit[]): PlaceAggregate[] => {
  const map = new Map<string, PlaceAggregate>();

  for (const visit of visits) {
    const key = `${visit.placeName}:${visit.latitude.toFixed(4)}:${visit.longitude.toFixed(4)}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        key,
        placeName: visit.placeName,
        category: visit.category,
        latitude: visit.latitude,
        longitude: visit.longitude,
        city: visit.city,
        country: visit.country,
        visitCount: 1,
        totalMinutes: visit.durationMinutes,
        lastVisitedAt: visit.arrivedAt,
      });
      continue;
    }

    existing.visitCount += 1;
    existing.totalMinutes += visit.durationMinutes;
    if (new Date(visit.arrivedAt) > new Date(existing.lastVisitedAt)) {
      existing.lastVisitedAt = visit.arrivedAt;
    }
  }

  return [...map.values()];
};

export const getVisitStats = (visits: Visit[]) => {
  const uniquePlaces = new Set(visits.map((visit) => `${visit.placeName}:${visit.latitude}:${visit.longitude}`));
  const uniqueCities = new Set(visits.map((visit) => visit.city).filter(Boolean));
  const uniqueCountries = new Set(visits.map((visit) => visit.country).filter(Boolean));
  const totalMinutes = visits.reduce((sum, visit) => sum + visit.durationMinutes, 0);

  return {
    totalVisits: visits.length,
    uniquePlaces: uniquePlaces.size,
    cities: uniqueCities.size,
    countries: uniqueCountries.size,
    totalMinutes,
    averageDurationMinutes: visits.length ? Math.round(totalMinutes / visits.length) : 0,
  };
};
