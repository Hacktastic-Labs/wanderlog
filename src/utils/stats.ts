import type { Visit } from '@/types/domain';

export const buildCategoryDistribution = (visits: Visit[]) => {
  const counts = new Map<string, number>();
  for (const visit of visits) {
    counts.set(visit.category, (counts.get(visit.category) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

export const computeConsecutiveDayStreak = (visits: Visit[]) => {
  const uniqueDays = [...new Set(visits.map((visit) => visit.arrivedAt.slice(0, 10)))].sort().reverse();
  if (!uniqueDays.length) {
    return 0;
  }

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(uniqueDays[index - 1]);
    const current = new Date(uniqueDays[index]);
    const diffDays = (previous.getTime() - current.getTime()) / (24 * 60 * 60 * 1000);
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};
