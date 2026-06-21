/**
 * Places API service — proxied through the WanderLog Go backend.
 *
 * Requires the backend to be running with DEV_GOOGLE_PLACES_API_KEY configured.
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { PLACES_NEARBY_RADIUS } from '@/constants/places';
import type { PlaceDetail, PlaceSummary } from '@/types/places';

class PlacesApiError extends Error {
  constructor(
    message: string,
    public status?: string,
  ) {
    super(message);
    this.name = 'PlacesApiError';
  }
}

export type PlacesPage = {
  results: PlaceSummary[];
  nextPageToken?: string;
};

type BackendSearchResponse = {
  results: PlaceSummary[];
  nextPageToken?: string;
};

async function placesFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // Ignore invalid JSON bodies.
    }
    throw new PlacesApiError(message);
  }

  return response.json() as Promise<T>;
}

/** Nearby Search — requires lat/lng */
export const searchNearby = async (
  latitude: number,
  longitude: number,
  types: string[],
  keyword?: string,
  pageToken?: string,
): Promise<PlaceSummary[]> => {
  const page = await searchNearbyPage(latitude, longitude, types, keyword, pageToken);
  return page.results;
};

/** Text Search — for city/area queries */
export const searchByText = async (
  query: string,
  types: string[],
  keyword?: string,
  pageToken?: string,
): Promise<PlaceSummary[]> => {
  const page = await searchByTextPage(query, types, keyword, pageToken);
  return page.results;
};

export const searchNearbyPage = (
  latitude: number,
  longitude: number,
  types: string[],
  keyword?: string,
  pageToken?: string,
): Promise<PlacesPage> =>
  placesFetch<BackendSearchResponse>(API_ENDPOINTS.places.nearbySearch, {
    lat: String(latitude),
    lng: String(longitude),
    radius: String(PLACES_NEARBY_RADIUS),
    type: types[0] ?? '',
    keyword: keyword ?? '',
    pagetoken: pageToken ?? '',
  });

export const searchByTextPage = (
  query: string,
  types: string[],
  keyword?: string,
  pageToken?: string,
): Promise<PlacesPage> =>
  placesFetch<BackendSearchResponse>(API_ENDPOINTS.places.textSearch, {
    query,
    type: types[0] ?? '',
    keyword: keyword ?? '',
    pagetoken: pageToken ?? '',
  });

/** Place Details */
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetail> =>
  placesFetch<PlaceDetail>(API_ENDPOINTS.places.details(placeId));

/** Google requires a short delay before using next_page_token */
export const PLACES_PAGE_TOKEN_DELAY_MS = 2000;

/** Build a photo URL served by the backend proxy */
export const getPhotoUrl = (photoReference: string, maxWidth = 800): string => {
  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.places.photo}`);
  url.searchParams.set('photo_reference', photoReference);
  url.searchParams.set('maxwidth', String(maxWidth));
  return url.toString();
};

/** Compute distance in metres between two lat/lng points (Haversine) */
export const computeDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/** Format a distance in metres to a human-readable string */
export const formatDistance = (metres: number): string => {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
};
