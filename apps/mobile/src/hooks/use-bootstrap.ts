import { useEffect } from 'react';

import { consumeBackgroundLocationBuffer } from '@/services/location/location-task.registry';
import { useAuthStore } from '@/stores/auth.store';
import { useVisitsStore } from '@/stores/visits.store';

export const useBootstrap = () => {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const setLocationPoints = useVisitsStore((state) => state.setLocationPoints);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const run = async () => {
      const buffered = await consumeBackgroundLocationBuffer();
      if (!buffered.length) {
        return;
      }

      setLocationPoints(
        buffered.map((point, index) => ({
          id: `buffered-${index}-${point.timestamp}`,
          userId: 'buffered',
          latitude: point.latitude,
          longitude: point.longitude,
          recordedAt: point.timestamp,
        })),
      );
    };

    run();
  }, [setLocationPoints]);
};
