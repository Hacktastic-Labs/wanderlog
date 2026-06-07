import type { UserProfile } from '@/types/domain';

/** Set to true when backend auth is wired (apps/backend). Keep false for local-only mode. */
export const AUTH_ENABLED = false;

export const DEV_USER_ID = '00000000-0000-4000-8000-000000000001';

export const DEV_USER_PROFILE: UserProfile = {
  id: DEV_USER_ID,
  email: 'dev@local.wanderlog',
  name: 'Explorer',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};
