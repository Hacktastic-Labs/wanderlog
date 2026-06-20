/**
 * Google Places API types used across the Explore feature.
 */

export type PlaceCategory =
  | 'all'
  | 'food'
  | 'restaurant'
  | 'cafe'
  | 'activity'
  | 'attraction'
  | 'park'
  | 'shopping'
  | 'nightlife';

export type PlaceLocation = {
  lat: number;
  lng: number;
};

export type PlacePhoto = {
  photo_reference: string;
  height: number;
  width: number;
};

export type PlaceOpeningHours = {
  open_now?: boolean;
  weekday_text?: string[];
};

export type PlaceReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
};

/** Minimal shape returned by Nearby/Text Search */
export type PlaceSummary = {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: PlacePhoto[];
  opening_hours?: PlaceOpeningHours;
  geometry: {
    location: PlaceLocation;
  };
  types?: string[];
  price_level?: number;
  /** Distance in metres — computed client-side from user location */
  distance?: number;
};

/** Full place detail returned by Place Details API */
export type PlaceDetail = PlaceSummary & {
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  reviews?: PlaceReview[];
  opening_hours?: PlaceOpeningHours & {
    periods?: {
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }[];
  };
  address_components?: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
};

export type LocationMode = 'near_me' | 'custom';

export type ExploreLocation = {
  mode: LocationMode;
  /** User coordinates when mode === 'near_me' */
  coords?: { latitude: number; longitude: number };
  /** City / area text when mode === 'custom' */
  query?: string;
  /** Display label shown in the header */
  label: string;
};

export type ExploreSection = {
  id: string;
  title: string;
  emoji: string;
  types: string[];
  keyword?: string;
};
