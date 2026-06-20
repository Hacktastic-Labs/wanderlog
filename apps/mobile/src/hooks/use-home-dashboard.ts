import { useMemo } from 'react';

import { DEMO_VISITS } from '@/constants/home';
import { useAuthStore } from '@/stores/auth.store';
import { useVisitsStore } from '@/stores/visits.store';
import type { Visit } from '@/types/domain';

export type DashboardStats = {
  totalPlacesVisited: number;
  citiesVisited: number;
  countriesVisited: number;
  placesThisMonth: number;
};

export type DashboardInsight = {
  id: string;
  emoji: string;
  title: string;
  value: string;
  subtitle?: string;
};

export type HomeDashboardData = {
  firstName: string;
  greeting: string;
  stats: DashboardStats;
  recentVisits: Visit[];
  insights: DashboardInsight[];
  isDemoData: boolean;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getFirstName = (name?: string | null) => {
  if (!name?.trim()) return 'Explorer';
  return name.trim().split(/\s+/)[0] ?? name;
};

const isSameMonth = (dateIso: string, reference = new Date()) => {
  const date = new Date(dateIso);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
};

const isWithinDays = (dateIso: string, days: number) => {
  const date = new Date(dateIso);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
};

const computeStats = (visits: Visit[]): DashboardStats => {
  const uniquePlaces = new Set(visits.map((v) => v.placeName.toLowerCase()));
  const uniqueCities = new Set(
    visits.map((v) => v.city?.toLowerCase()).filter(Boolean) as string[],
  );
  const uniqueCountries = new Set(
    visits.map((v) => v.country?.toLowerCase()).filter(Boolean) as string[],
  );

  return {
    totalPlacesVisited: uniquePlaces.size,
    citiesVisited: uniqueCities.size,
    countriesVisited: uniqueCountries.size,
    placesThisMonth: visits.filter((v) => isSameMonth(v.arrivedAt)).length,
  };
};

const computeInsights = (visits: Visit[]): DashboardInsight[] => {
  if (visits.length === 0) {
    return [];
  }

  const cafeCounts = new Map<string, number>();
  for (const visit of visits) {
    if (visit.category === 'cafe') {
      cafeCounts.set(visit.placeName, (cafeCounts.get(visit.placeName) ?? 0) + 1);
    }
  }

  let mostVisitedCafe = { name: '—', count: 0 };
  for (const [name, count] of cafeCounts) {
    if (count > mostVisitedCafe.count) {
      mostVisitedCafe = { name, count };
    }
  }

  const longestStay = visits.reduce((best, visit) =>
    visit.durationMinutes > best.durationMinutes ? visit : best,
  );

  const weekVisits = visits.filter((v) => isWithinDays(v.arrivedAt, 7));
  const priorPlaceNames = new Set(
    visits
      .filter((v) => !isWithinDays(v.arrivedAt, 7))
      .map((v) => v.placeName.toLowerCase()),
  );
  const newThisWeek = weekVisits.find(
    (v) => !priorPlaceNames.has(v.placeName.toLowerCase()),
  );

  const cityCounts = new Map<string, number>();
  for (const visit of visits) {
    const city = visit.city ?? 'Unknown';
    cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
  }

  let favoriteArea = { city: '—', count: 0 };
  for (const [city, count] of cityCounts) {
    if (count > favoriteArea.count) {
      favoriteArea = { city, count };
    }
  }

  return [
    {
      id: 'most-cafe',
      emoji: '☕',
      title: 'Most Visited Café',
      value: mostVisitedCafe.count > 0 ? mostVisitedCafe.name : 'No cafés yet',
      subtitle:
        mostVisitedCafe.count > 1 ? `${mostVisitedCafe.count} visits` : undefined,
    },
    {
      id: 'longest-stay',
      emoji: '⏱️',
      title: 'Longest Stay',
      value: longestStay.placeName,
      subtitle: formatDuration(longestStay.durationMinutes),
    },
    {
      id: 'new-place',
      emoji: '✨',
      title: 'New Place This Week',
      value: newThisWeek?.placeName ?? 'None yet',
      subtitle: newThisWeek ? formatVisitDate(newThisWeek.arrivedAt) : undefined,
    },
    {
      id: 'favorite-area',
      emoji: '📍',
      title: 'Favorite Area',
      value: favoriteArea.city,
      subtitle:
        favoriteArea.count > 0 ? `${favoriteArea.count} visits` : undefined,
    },
  ];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
};

export const formatVisitDate = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today · ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Yesterday · ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const useHomeDashboard = (): HomeDashboardData => {
  const storedVisits = useVisitsStore((state) => state.visits);
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);

  return useMemo(() => {
    const isDemoData = storedVisits.length === 0;
    const visits = isDemoData ? DEMO_VISITS : storedVisits;
    const displayName = profile?.name ?? session?.user.name;

    const recentVisits = [...visits]
      .sort((a, b) => new Date(b.arrivedAt).getTime() - new Date(a.arrivedAt).getTime())
      .slice(0, 5);

    return {
      firstName: getFirstName(displayName),
      greeting: getGreeting(),
      stats: computeStats(visits),
      recentVisits,
      insights: computeInsights(visits),
      isDemoData,
    };
  }, [storedVisits, session?.user.name, profile?.name]);
};
