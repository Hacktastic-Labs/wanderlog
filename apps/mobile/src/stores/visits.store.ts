import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LocationPoint, Visit, VisitDraft } from '@/types/domain';

type VisitsState = {
  visits: Visit[];
  locationPoints: LocationPoint[];
  pendingCheckIns: VisitDraft[];
  setLocationPoints: (points: LocationPoint[]) => void;
  removePendingCheckIn: (index: number) => void;
};

export const useVisitsStore = create<VisitsState>()(
  persist(
    (set) => ({
      visits: [],
      locationPoints: [],
      pendingCheckIns: [],
      setLocationPoints: (points) => set({ locationPoints: points }),
      removePendingCheckIn: (index) =>
        set((state) => ({
          pendingCheckIns: state.pendingCheckIns.filter((_, currentIndex) => currentIndex !== index),
        })),
    }),
    {
      name: 'wanderlog-visits',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
