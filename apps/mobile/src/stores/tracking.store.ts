import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TrackingState = {
  pauseTracking: boolean;
  disableBackgroundTracking: boolean;
  foregroundPermissionGranted: boolean;
  backgroundPermissionGranted: boolean;
  isForegroundTrackingActive: boolean;
  setPauseTracking: (value: boolean) => void;
  setDisableBackgroundTracking: (value: boolean) => void;
  setForegroundPermission: (value: boolean) => void;
  setBackgroundPermission: (value: boolean) => void;
  setForegroundTrackingActive: (value: boolean) => void;
};

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      pauseTracking: false,
      disableBackgroundTracking: true,
      foregroundPermissionGranted: false,
      backgroundPermissionGranted: false,
      isForegroundTrackingActive: false,
      setPauseTracking: (value) => set({ pauseTracking: value }),
      setDisableBackgroundTracking: (value) => set({ disableBackgroundTracking: value }),
      setForegroundPermission: (value) => set({ foregroundPermissionGranted: value }),
      setBackgroundPermission: (value) => set({ backgroundPermissionGranted: value }),
      setForegroundTrackingActive: (value) => set({ isForegroundTrackingActive: value }),
    }),
    {
      name: 'wanderlog-tracking',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
