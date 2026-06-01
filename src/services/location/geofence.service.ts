import * as Location from 'expo-location';

import { GEOFENCE_TASK } from '@/services/location/location.constants';

export const startGeofencing = async (regions: Location.LocationRegion[]) => {
  await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
};

export const stopGeofencing = async () => {
  const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
  if (!started) {
    return;
  }
  await Location.stopGeofencingAsync(GEOFENCE_TASK);
};
