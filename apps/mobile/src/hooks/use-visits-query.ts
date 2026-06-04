import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/wanderlog';
import { getVisits } from '@/services/api/visits.api';
import { selectUserId, useAuthStore } from '@/stores/auth.store';
import { useVisitsStore } from '@/stores/visits.store';

export const useVisitsQuery = () => {
  const userId = useAuthStore(selectUserId);
  const filters = useVisitsStore((state) => state.filters);
  const setVisits = useVisitsStore((state) => state.setVisits);

  return useQuery({
    queryKey: [...QUERY_KEYS.visits, userId, filters],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const visits = await getVisits(userId, filters);
      setVisits(visits);
      return visits;
    },
    enabled: Boolean(userId),
  });
};
