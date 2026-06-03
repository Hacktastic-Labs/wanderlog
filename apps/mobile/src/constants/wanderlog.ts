import type { VisitCategory, VisitDetectionConfig } from '@/types/domain';

export const WANDERLOG_BRAND = {
  name: 'WanderLog',
  subtitle: 'Personal location journal',
};

export const VISIT_DETECTION_CONFIG: VisitDetectionConfig = {
  radiusMeters: 100,
  minimumDurationMinutes: 15,
};

export const VISIT_CATEGORIES: VisitCategory[] = [
  'restaurant',
  'cafe',
  'gym',
  'park',
  'mall',
  'office',
  'home',
  'school',
  'hospital',
  'sports_facility',
  'store',
  'other',
];

export const CATEGORY_LABELS: Record<VisitCategory, string> = {
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  gym: 'Gym',
  park: 'Park',
  mall: 'Mall',
  office: 'Office',
  home: 'Home',
  school: 'School',
  hospital: 'Hospital',
  sports_facility: 'Sports Facility',
  store: 'Store',
  other: 'Other',
};

export const QUERY_KEYS = {
  profile: ['profile'] as const,
  visits: ['visits'] as const,
  locationPoints: ['location-points'] as const,
  stats: ['stats'] as const,
};
