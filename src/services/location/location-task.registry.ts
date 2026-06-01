import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { BACKGROUND_LOCATION_TASK, GEOFENCE_TASK } from '@/services/location/location.constants';

const BACKGROUND_BUFFER_KEY = 'wanderlog-background-buffer';

type BufferedPoint = {
  latitude: number;
  longitude: number;
  timestamp: string;
};

const appendPointsToBuffer = async (points: BufferedPoint[]) => {
  const existingRaw = await AsyncStorage.getItem(BACKGROUND_BUFFER_KEY);
  const existing = existingRaw ? (JSON.parse(existingRaw) as BufferedPoint[]) : [];
  const next = [...existing, ...points].slice(-2000);
  await AsyncStorage.setItem(BACKGROUND_BUFFER_KEY, JSON.stringify(next));
};

export const consumeBackgroundLocationBuffer = async (): Promise<BufferedPoint[]> => {
  const raw = await AsyncStorage.getItem(BACKGROUND_BUFFER_KEY);
  if (!raw) {
    return [];
  }
  await AsyncStorage.removeItem(BACKGROUND_BUFFER_KEY);
  return JSON.parse(raw) as BufferedPoint[];
};

if (!TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error || !data) {
      return;
    }

    const payload = data as { locations?: Location.LocationObject[] };
    const points = (payload.locations ?? []).map((item) => ({
      latitude: item.coords.latitude,
      longitude: item.coords.longitude,
      timestamp: new Date(item.timestamp).toISOString(),
    }));

    if (points.length) {
      await appendPointsToBuffer(points);
    }
  });
}

if (!TaskManager.isTaskDefined(GEOFENCE_TASK)) {
  TaskManager.defineTask(GEOFENCE_TASK, ({ data, error }) => {
    if (error || !data) {
      return;
    }
  });
}
