import { useVisitsStore } from '@/stores/visits.store';
import type { LocationPoint } from '@/types/domain';
import { createLocalId } from '@/utils/id';

export const createLocationPoints = async (
  userId: string,
  points: { latitude: number; longitude: number; recordedAt: string }[],
) => {
  if (!points.length) {
    return [];
  }

  const mapped: LocationPoint[] = points.map((point) => ({
    id: createLocalId('point'),
    userId,
    latitude: point.latitude,
    longitude: point.longitude,
    recordedAt: point.recordedAt,
  }));

  useVisitsStore.setState((state) => ({
    locationPoints: [...mapped, ...state.locationPoints].slice(0, 5000),
  }));

  return mapped;
};

export const getLocationPoints = async (userId: string) => {
  return useVisitsStore.getState().locationPoints.filter((point) => point.userId === userId);
};
