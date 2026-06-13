import { useVisitsStore } from '@/stores/visits.store';
import type { Visit, VisitDraft } from '@/types/domain';
import { createLocalId } from '@/utils/id';

export const createVisit = async (draft: VisitDraft) => {
  const visit: Visit = {
    id: createLocalId('visit'),
    createdAt: new Date().toISOString(),
    ...draft,
  };

  useVisitsStore.setState((state) => ({
    visits: [visit, ...state.visits],
  }));

  return visit;
};
