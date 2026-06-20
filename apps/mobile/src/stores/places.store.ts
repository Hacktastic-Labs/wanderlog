import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PlaceSummary } from '@/types/places';

type PlacesState = {
  savedPlaces: PlaceSummary[];
  savePlace: (place: PlaceSummary) => void;
  unsavePlace: (placeId: string) => void;
  isSaved: (placeId: string) => boolean;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      savedPlaces: [],
      savePlace: (place) => {
        set((state) => {
          if (state.savedPlaces.some((p) => p.place_id === place.place_id)) {
            return state;
          }
          return { savedPlaces: [place, ...state.savedPlaces] };
        });
      },
      unsavePlace: (placeId) => {
        set((state) => ({
          savedPlaces: state.savedPlaces.filter((p) => p.place_id !== placeId),
        }));
      },
      isSaved: (placeId) => get().savedPlaces.some((p) => p.place_id === placeId),
    }),
    {
      name: 'wanderlog-places',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
