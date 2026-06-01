import { getSupabaseClient } from '@/lib/supabase';
import type { PlaceAggregate, Visit, VisitDraft, VisitFilters } from '@/types/domain';

const mapVisit = (row: {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  place_name: string;
  address: string | null;
  category: string;
  city: string | null;
  state: string | null;
  country: string | null;
  arrived_at: string;
  departed_at: string;
  duration_minutes: number;
  created_at: string;
}): Visit => ({
  id: row.id,
  userId: row.user_id,
  latitude: row.latitude,
  longitude: row.longitude,
  placeName: row.place_name,
  address: row.address,
  category: row.category as Visit['category'],
  city: row.city,
  state: row.state,
  country: row.country,
  arrivedAt: row.arrived_at,
  departedAt: row.departed_at,
  durationMinutes: row.duration_minutes,
  createdAt: row.created_at,
});

export const createVisit = async (draft: VisitDraft) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('visits')
    .insert({
      user_id: draft.userId,
      latitude: draft.latitude,
      longitude: draft.longitude,
      place_name: draft.placeName,
      address: draft.address,
      category: draft.category,
      city: draft.city,
      state: draft.state,
      country: draft.country,
      arrived_at: draft.arrivedAt,
      departed_at: draft.departedAt,
      duration_minutes: draft.durationMinutes,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapVisit(data);
};

export const getVisits = async (userId: string, filters?: VisitFilters) => {
  const supabase = getSupabaseClient();
  let query = supabase.from('visits').select('*').eq('user_id', userId).order('arrived_at', { ascending: false });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }
  if (filters?.country) {
    query = query.ilike('country', `%${filters.country}%`);
  }
  if (filters?.startDate) {
    query = query.gte('arrived_at', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('arrived_at', filters.endDate);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  let visits = data.map(mapVisit);
  if (filters?.query) {
    const lower = filters.query.toLowerCase();
    visits = visits.filter((visit) =>
      [visit.placeName, visit.city, visit.country, visit.category].some((value) =>
        (value ?? '').toLowerCase().includes(lower),
      ),
    );
  }

  return visits;
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
