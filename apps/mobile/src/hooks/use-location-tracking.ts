import { useCallback } from 'react';
import { Alert } from 'react-native';

import { createLocationPoints } from '@/services/api/location-points.api';
import { createVisit } from '@/services/api/visits.api';
import { startBackgroundTracking, stopBackgroundTracking } from '@/services/location/background-tracker.service';
import { startForegroundTracking, stopForegroundTracking } from '@/services/location/foreground-tracker.service';
import {
    getPermissionSnapshot,
    requestBackgroundLocationPermission,
    requestForegroundLocationPermission,
} from '@/services/location/location-permission.service';
import { reverseGeocodeCoordinates } from '@/services/location/reverse-geocode.service';
import { VisitDetectorService } from '@/services/location/visit-detector.service';
import { selectUserId, useAuthStore } from '@/stores/auth.store';
import { useTrackingStore } from '@/stores/tracking.store';
import { useVisitsStore } from '@/stores/visits.store';

const detector = new VisitDetectorService();

export const useLocationTracking = () => {
  const userId = useAuthStore(selectUserId);
  const setForegroundPermission = useTrackingStore((state) => state.setForegroundPermission);
  const setBackgroundPermission = useTrackingStore((state) => state.setBackgroundPermission);
  const setForegroundTrackingActive = useTrackingStore((state) => state.setForegroundTrackingActive);
  const disableBackgroundTracking = useTrackingStore((state) => state.disableBackgroundTracking);
  const pauseTracking = useTrackingStore((state) => state.pauseTracking);
  const enqueueCheckIn = useVisitsStore((state) => state.enqueueCheckIn);

  const refreshPermissions = useCallback(async () => {
    const snapshot = await getPermissionSnapshot();
    setForegroundPermission(snapshot.foregroundGranted);
    setBackgroundPermission(snapshot.backgroundGranted);
    return snapshot;
  }, [setBackgroundPermission, setForegroundPermission]);

  const askPermissions = useCallback(async () => {
    const foregroundGranted = await requestForegroundLocationPermission();
    setForegroundPermission(foregroundGranted);

    let backgroundGranted = false;
    if (foregroundGranted && !disableBackgroundTracking) {
      backgroundGranted = await requestBackgroundLocationPermission();
      setBackgroundPermission(backgroundGranted);
    }

    return { foregroundGranted, backgroundGranted };
  }, [disableBackgroundTracking, setBackgroundPermission, setForegroundPermission]);

  const startTracking = useCallback(async () => {
    if (!userId || pauseTracking) {
      return;
    }

    const { foregroundGranted, backgroundGranted } = await askPermissions();
    if (!foregroundGranted) {
      Alert.alert('Location permission required', 'Allow location to start tracking your visits.');
      return;
    }

    await startForegroundTracking(async (point) => {
      if (!userId) {
        return;
      }

      await createLocationPoints(userId, [
        {
          latitude: point.latitude,
          longitude: point.longitude,
          recordedAt: point.timestamp,
        },
      ]);

      const geocode = await reverseGeocodeCoordinates(point.latitude, point.longitude);
      const detected = detector.ingest({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: point.timestamp,
        userId,
        placeName: geocode.placeName,
        address: geocode.address,
        city: geocode.city,
        state: geocode.state,
        country: geocode.country,
      });

      if (detected) {
        try {
          await createVisit(detected);
        } catch {
          enqueueCheckIn(detected);
        }
      }
    });

    setForegroundTrackingActive(true);

    if (backgroundGranted && !disableBackgroundTracking) {
      await startBackgroundTracking();
    }
  }, [askPermissions, disableBackgroundTracking, enqueueCheckIn, pauseTracking, userId, setForegroundTrackingActive]);

  const stopTracking = useCallback(async () => {
    stopForegroundTracking();
    await stopBackgroundTracking();
    setForegroundTrackingActive(false);
  }, [setForegroundTrackingActive]);

  return {
    refreshPermissions,
    startTracking,
    stopTracking,
  };
};
