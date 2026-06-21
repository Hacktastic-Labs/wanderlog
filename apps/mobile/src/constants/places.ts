import type { ExploreSection, PlaceCategory } from '@/types/places';

export type CategoryConfig = {
  id: PlaceCategory;
  label: string;
  /** Google Places API types for filtering */
  types: string[];
  keyword?: string;
};

export const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All', types: [] },
  { id: 'food', label: 'Food', types: ['food', 'meal_takeaway', 'meal_delivery'] },
  {
    id: 'restaurant',
    label: 'Restaurants',
    types: ['restaurant'],
  },
  { id: 'cafe', label: 'Cafes', types: ['cafe'] },
  {
    id: 'activity',
    label: 'Activities',
    types: ['amusement_park', 'bowling_alley', 'gym', 'movie_theater'],
  },
  {
    id: 'attraction',
    label: 'Attractions',
    types: ['tourist_attraction', 'museum', 'art_gallery'],
  },
  { id: 'park', label: 'Parks', types: ['park', 'natural_feature'] },
  {
    id: 'shopping',
    label: 'Shopping',
    types: ['shopping_mall', 'store', 'clothing_store', 'supermarket'],
  },
  { id: 'nightlife', label: 'Nightlife', types: ['bar', 'night_club', 'casino'] },
];

export const EXPLORE_SECTIONS: ExploreSection[] = [
  {
    id: 'trending',
    title: 'Trending Near You',
    emoji: '🔥',
    types: [],
    keyword: 'popular',
  },
  {
    id: 'cafes',
    title: 'Popular Cafes',
    emoji: '☕',
    types: ['cafe'],
  },
  {
    id: 'restaurants',
    title: 'Top Restaurants',
    emoji: '🍴',
    types: ['restaurant'],
  },
  {
    id: 'activities',
    title: 'Activities & Experiences',
    emoji: '🎯',
    types: ['amusement_park', 'bowling_alley', 'movie_theater', 'gym'],
    keyword: 'activities',
  },
  {
    id: 'hidden_gems',
    title: 'Hidden Gems',
    emoji: '📍',
    types: ['tourist_attraction'],
    keyword: 'hidden gem',
  },
];

export const PLACES_NEARBY_RADIUS = 5000; // metres

export const CARD_WIDTH = 220;
export const CARD_HEIGHT = 280;
export const LARGE_CARD_WIDTH = 300;
export const LARGE_CARD_HEIGHT = 360;
