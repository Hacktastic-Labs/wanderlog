import * as Location from 'expo-location';

import { createVisit } from '@/services/api/visits.api';
import { reverseGeocodeCoordinates } from '@/services/location/reverse-geocode.service';
import { selectUserId, useAuthStore } from '@/stores/auth.store';
import { useVisitsStore } from '@/stores/visits.store';
import { nowIso } from '@/utils/date';

export const useManualCheckIn = () => {
  const userId = useAuthStore(selectUserId);
  const enqueueCheckIn = useVisitsStore((state) => state.enqueueCheckIn);

  const createManualCheckIn = async (durationMinutes = 30) => {
    if (!userId) {
      throw new Error('Please sign in to log visits.');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const geocode = await reverseGeocodeCoordinates(location.coords.latitude, location.coords.longitude);
    const timestamp = nowIso();

    const payload = {
      userId,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      placeName: geocode.placeName,
      address: geocode.address,
      category: geocode.category,
      city: geocode.city,
      state: geocode.state,
      country: geocode.country,
      arrivedAt: timestamp,
      departedAt: new Date(Date.now() + durationMinutes * 60_000).toISOString(),
      durationMinutes,
    };

    try {
      return await createVisit(payload);
    } catch {
      enqueueCheckIn(payload);
      return null;
    }
  };

  return {
    createManualCheckIn,
  };
};
