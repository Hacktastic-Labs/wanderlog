import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LocationPoint, Visit, VisitDraft, VisitFilters } from '@/types/domain';

type VisitsState = {
  visits: Visit[];
  filters: VisitFilters;
  locationPoints: LocationPoint[];
  pendingCheckIns: VisitDraft[];
  setVisits: (visits: Visit[]) => void;
  setFilters: (filters: Partial<VisitFilters>) => void;
  addLocationPoint: (point: LocationPoint) => void;
  setLocationPoints: (points: LocationPoint[]) => void;
  enqueueCheckIn: (draft: VisitDraft) => void;
  removePendingCheckIn: (index: number) => void;
  clearPendingCheckIns: () => void;
  clearLocalData: () => void;
};

export const useVisitsStore = create<VisitsState>()(
  persist(
    (set) => ({
      visits: [],
      filters: {
        category: 'all',
      },
      locationPoints: [],
      pendingCheckIns: [],
      setVisits: (visits) => set({ visits }),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      addLocationPoint: (point) =>
        set((state) => ({ locationPoints: [point, ...state.locationPoints].slice(0, 5000) })),
      setLocationPoints: (points) => set({ locationPoints: points }),
      enqueueCheckIn: (draft) => set((state) => ({ pendingCheckIns: [...state.pendingCheckIns, draft] })),
      removePendingCheckIn: (index) =>
        set((state) => ({
          pendingCheckIns: state.pendingCheckIns.filter((_, currentIndex) => currentIndex !== index),
        })),
      clearPendingCheckIns: () => set({ pendingCheckIns: [] }),
      clearLocalData: () =>
        set({
          visits: [],
          locationPoints: [],
          pendingCheckIns: [],
        }),
    }),
    {
      name: 'wanderlog-visits',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
