import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/wanderlog';
import { getVisits } from '@/services/api/visits.api';
import { useAuthStore } from '@/stores/auth.store';
import { useVisitsStore } from '@/stores/visits.store';

export const useVisitsQuery = () => {
  const session = useAuthStore((state) => state.session);
  const filters = useVisitsStore((state) => state.filters);
  const setVisits = useVisitsStore((state) => state.setVisits);

  return useQuery({
    queryKey: [...QUERY_KEYS.visits, session?.user.id, filters],
    queryFn: async () => {
      if (!session?.user.id) {
        return [];
      }
      const visits = await getVisits(session.user.id, filters);
      setVisits(visits);
      return visits;
    },
    enabled: Boolean(session?.user.id),
  });
};
