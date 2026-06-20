import * as WebBrowser from 'expo-web-browser';
import { Linking, Share } from 'react-native';

import type { PlaceDetail, PlaceSummary } from '@/types/places';

export const sharePlace = async (place: PlaceSummary | PlaceDetail) => {
  const address = place.formatted_address ?? place.vicinity ?? '';
  const message = [place.name, address].filter(Boolean).join('\n');

  await Share.share({
    message,
    title: place.name,
  });
};

export const openInGoogleMaps = (place: PlaceSummary | PlaceDetail) => {
  const { lat, lng } = place.geometry.location;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.place_id}`;
  return Linking.openURL(url);
};

export const callPlace = (phone: string) => {
  const cleaned = phone.replace(/\s/g, '');
  return Linking.openURL(`tel:${cleaned}`);
};

export const openWebsite = async (url: string) => {
  await WebBrowser.openBrowserAsync(url);
};
