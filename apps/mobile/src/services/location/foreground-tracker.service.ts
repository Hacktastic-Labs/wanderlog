import * as Location from 'expo-location';

import {
    FOREGROUND_DISTANCE_INTERVAL_METERS,
    FOREGROUND_TIME_INTERVAL_MS,
} from '@/services/location/location.constants';

type LocationPointCallback = (point: {
  latitude: number;
  longitude: number;
  timestamp: string;
}) => Promise<void>;

let foregroundSubscription: Location.LocationSubscription | null = null;

export const startForegroundTracking = async (onPoint: LocationPointCallback) => {
  if (foregroundSubscription) {
    return;
  }

  foregroundSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: FOREGROUND_DISTANCE_INTERVAL_METERS,
      timeInterval: FOREGROUND_TIME_INTERVAL_MS,
    },
    async (location) => {
      await onPoint({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(location.timestamp).toISOString(),
      });
    },
  );
};

export const stopForegroundTracking = () => {
  if (!foregroundSubscription) {
    return;
  }

  foregroundSubscription.remove();
  foregroundSubscription = null;
};
