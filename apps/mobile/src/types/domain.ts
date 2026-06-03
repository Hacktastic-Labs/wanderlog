export type VisitCategory =
  | 'restaurant'
  | 'cafe'
  | 'gym'
  | 'park'
  | 'mall'
  | 'office'
  | 'home'
  | 'school'
  | 'hospital'
  | 'sports_facility'
  | 'store'
  | 'other';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
};

export type Visit = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  placeName: string;
  address?: string | null;
  category: VisitCategory;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  arrivedAt: string;
  departedAt: string;
  durationMinutes: number;
  createdAt: string;
};

export type LocationPoint = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
};

export type VisitDetectionConfig = {
  radiusMeters: number;
  minimumDurationMinutes: number;
};

export type VisitDraft = Omit<Visit, 'id' | 'createdAt'>;

export type VisitFilters = {
  query?: string;
  category?: VisitCategory | 'all';
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
};

export type PlaceAggregate = {
  key: string;
  placeName: string;
  category: VisitCategory;
  latitude: number;
  longitude: number;
  city?: string | null;
  country?: string | null;
  visitCount: number;
  totalMinutes: number;
  lastVisitedAt: string;
};

export type LifeReplayFrame = {
  timestamp: string;
  latitude: number;
  longitude: number;
  placeName?: string;
};
