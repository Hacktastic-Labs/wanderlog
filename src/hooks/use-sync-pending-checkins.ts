import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

import { createVisit } from '@/services/api/visits.api';
import { useVisitsStore } from '@/stores/visits.store';

export const useSyncPendingCheckIns = () => {
  const pendingCheckIns = useVisitsStore((state) => state.pendingCheckIns);
  const removePendingCheckIn = useVisitsStore((state) => state.removePendingCheckIn);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected || !pendingCheckIns.length) {
        return;
      }

      for (const draft of pendingCheckIns) {
        try {
          await createVisit(draft);
          removePendingCheckIn(0);
        } catch {
          return;
        }
      }
    });

    return unsubscribe;
  }, [pendingCheckIns, removePendingCheckIn]);
};
