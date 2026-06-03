import { getSupabaseClient } from '@/lib/supabase';
import type { LocationPoint } from '@/types/domain';

const mapLocationPoint = (row: {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  recorded_at: string;
}): LocationPoint => ({
  id: row.id,
  userId: row.user_id,
  latitude: row.latitude,
  longitude: row.longitude,
  recordedAt: row.recorded_at,
});

export const createLocationPoints = async (
  userId: string,
  points: { latitude: number; longitude: number; recordedAt: string }[],
) => {
  const supabase = getSupabaseClient();
  if (!points.length) {
    return [];
  }

  const { data, error } = await supabase
    .from('location_points')
    .insert(
      points.map((point) => ({
        user_id: userId,
        latitude: point.latitude,
        longitude: point.longitude,
        recorded_at: point.recordedAt,
      })),
    )
    .select('*');

  if (error) {
    throw error;
  }

  return data.map(mapLocationPoint);
};

export const getLocationPoints = async (userId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('location_points')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(5000);

  if (error) {
    throw error;
  }

  return data.map(mapLocationPoint);
};
