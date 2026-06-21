import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { CATEGORIES, EXPLORE_SECTIONS } from '@/constants/places';
import {
  computeDistance,
  getPlaceDetails,
  PLACES_PAGE_TOKEN_DELAY_MS,
  searchByTextPage,
  searchNearbyPage,
} from '@/services/api/places.api';
import type { ExploreLocation, ExploreSection, PlaceCategory, PlaceSummary } from '@/types/places';

const locationQueryKey = (location: ExploreLocation | null) => {
  if (!location) return 'none';
  if (location.mode === 'near_me' && location.coords) {
    return `near:${location.coords.latitude.toFixed(4)},${location.coords.longitude.toFixed(4)}`;
  }
  return `${location.mode}:${location.query ?? location.label}`;
};

/** Attach distance to each place summary when user coords are available */
const withDistance = (
  places: PlaceSummary[],
  coords?: { latitude: number; longitude: number },
): PlaceSummary[] => {
  if (!coords) return places;
  return places.map((p) => ({
    ...p,
    distance: computeDistance(
      coords.latitude,
      coords.longitude,
      p.geometry.location.lat,
      p.geometry.location.lng,
    ),
  }));
};

const fetchPlacesPage = async (
  location: ExploreLocation,
  types: string[],
  keyword: string | undefined,
  pageToken?: string,
) => {
  if (pageToken) {
    await new Promise((resolve) => setTimeout(resolve, PLACES_PAGE_TOKEN_DELAY_MS));
  }

  if (location.mode === 'near_me' && location.coords) {
    const page = await searchNearbyPage(
      location.coords.latitude,
      location.coords.longitude,
      types,
      keyword,
      pageToken,
    );
    return {
      results: withDistance(page.results, location.coords),
      nextPageToken: page.nextPageToken,
    };
  }

  if (location.mode === 'custom' && location.query) {
    const page = await searchByTextPage(location.query, types, keyword, pageToken);
    return {
      results: withDistance(page.results, location.coords),
      nextPageToken: page.nextPageToken,
    };
  }

  return { results: [], nextPageToken: undefined };
};

/** Fetches places for a single section given the current explore location */
export const useSectionPlaces = (
  section: ExploreSection,
  location: ExploreLocation | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['places', 'section', section.id, locationQueryKey(location)],
    queryFn: async () => {
      if (!location) return [];
      const page = await fetchPlacesPage(location, section.types, section.keyword);
      return page.results;
    },
    enabled: enabled && !!location,
    staleTime: 1000 * 60 * 5,
  });
};

/** Fetches places for a specific category search */
export const useCategoryPlaces = (
  types: string[],
  keyword: string | undefined,
  location: ExploreLocation | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['places', 'category', types.join(','), keyword ?? '', locationQueryKey(location)],
    queryFn: async () => {
      if (!location) return [];
      const page = await fetchPlacesPage(location, types, keyword);
      return page.results;
    },
    enabled: enabled && !!location,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteSectionPlaces = (
  section: ExploreSection,
  location: ExploreLocation | null,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: ['places', 'section', 'infinite', section.id, locationQueryKey(location)],
    queryFn: ({ pageParam }) => fetchPlacesPage(location!, section.types, section.keyword, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: enabled && !!location,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInfiniteCategoryPlaces = (
  category: PlaceCategory,
  location: ExploreLocation | null,
) => {
  const config = CATEGORIES.find((c) => c.id === category)!;

  return useInfiniteQuery({
    queryKey: [
      'places',
      'category',
      'infinite',
      category,
      locationQueryKey(location),
    ],
    queryFn: ({ pageParam }) =>
      fetchPlacesPage(location!, config.types, config.keyword, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!location && category !== 'all',
    staleTime: 1000 * 60 * 5,
  });
};

/** Fetches all section data for the Explore home view */
export const useAllSections = (location: ExploreLocation | null) => {
  const results = EXPLORE_SECTIONS.map((section) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSectionPlaces(section, location),
  );
  return results;
};

/** Place detail query */
export const usePlaceDetails = (placeId: string | null) => {
  return useQuery({
    queryKey: ['places', 'detail', placeId],
    queryFn: () => getPlaceDetails(placeId!),
    enabled: !!placeId,
    staleTime: 1000 * 60 * 10,
  });
};
