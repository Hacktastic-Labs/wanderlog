import * as Location from 'expo-location';

import { BACKGROUND_LOCATION_TASK } from '@/services/location/location.constants';

export const startBackgroundTracking = async () => {
  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (started) {
    return;
  }

  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 60_000,
    distanceInterval: 75,
    deferredUpdatesDistance: 150,
    deferredUpdatesInterval: 120_000,
    pausesUpdatesAutomatically: true,
    foregroundService: {
      notificationTitle: 'WanderLog tracking your journey',
      notificationBody: 'Tap to open WanderLog',
      killServiceOnDestroy: false,
    },
  });
};

export const stopBackgroundTracking = async () => {
  const started = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (!started) {
    return;
  }

  await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
};
