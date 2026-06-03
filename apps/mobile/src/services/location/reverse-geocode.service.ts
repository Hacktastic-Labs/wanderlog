import * as Location from 'expo-location';

import { inferCategoryFromAddress } from '@/utils/place';

export type ReverseGeocodeResult = {
  placeName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  category: ReturnType<typeof inferCategoryFromAddress>;
};

export const reverseGeocodeCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> => {
  const result = await Location.reverseGeocodeAsync({ latitude, longitude });

  const first = result[0];
  if (!first) {
    return {
      placeName: 'Dropped Pin',
      address: null,
      city: null,
      state: null,
      country: null,
      category: 'other',
    };
  }

  const placeName = first.name ?? first.street ?? 'Dropped Pin';
  const address = [first.streetNumber, first.street, first.city, first.region, first.country]
    .filter(Boolean)
    .join(', ');

  return {
    placeName,
    address: address || null,
    city: first.city,
    state: first.region,
    country: first.country,
    category: inferCategoryFromAddress(placeName, address),
  };
};
