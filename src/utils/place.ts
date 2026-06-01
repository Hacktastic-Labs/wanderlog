import type { VisitCategory } from '@/types/domain';

const categoryKeywords: Record<VisitCategory, string[]> = {
  restaurant: ['restaurant', 'diner', 'eatery', 'food'],
  cafe: ['cafe', 'coffee', 'starbucks', 'espresso'],
  gym: ['gym', 'fitness', 'workout'],
  park: ['park', 'garden'],
  mall: ['mall', 'shopping center', 'plaza'],
  office: ['office', 'corporate', 'business park'],
  home: ['home', 'residence', 'apartment'],
  school: ['school', 'college', 'university', 'institute'],
  hospital: ['hospital', 'clinic', 'medical', 'health'],
  sports_facility: ['stadium', 'arena', 'cricket', 'sports'],
  store: ['store', 'mart', 'market', 'shop'],
  other: [],
};

export const inferCategoryFromAddress = (name?: string | null, address?: string | null): VisitCategory => {
  const text = `${name ?? ''} ${address ?? ''}`.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords) as [VisitCategory, string[]][]) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return 'other';
};

export const formatPlaceName = (name?: string | null, fallback = 'Unknown Place') => {
  if (!name) {
    return fallback;
  }
  return name.trim();
};
