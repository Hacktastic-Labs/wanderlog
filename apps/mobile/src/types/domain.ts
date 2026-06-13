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

/** Client session shape (backend auth will populate this later). */
export type AppSession = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
  };
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

export type VisitDraft = Omit<Visit, 'id' | 'createdAt'>;
