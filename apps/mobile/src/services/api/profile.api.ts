import { DEV_USER_PROFILE } from '@/constants/features';
import { useAuthStore } from '@/stores/auth.store';
import type { UserProfile } from '@/types/domain';

export const fetchProfile = async (userId: string) => {
  const profile = useAuthStore.getState().profile;
  if (profile?.id === userId) {
    return profile;
  }
  if (userId === DEV_USER_PROFILE.id) {
    return DEV_USER_PROFILE;
  }
  throw new Error('Profile not found');
};

export const upsertProfile = async (payload: {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}) => {
  const profile: UserProfile = {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    avatarUrl: payload.avatarUrl ?? null,
    createdAt: new Date().toISOString(),
  };
  useAuthStore.getState().setProfile(profile);
  return profile;
};

export const updateProfile = async (userId: string, patch: { name?: string; avatarUrl?: string }) => {
  const current = await fetchProfile(userId);
  const profile: UserProfile = {
    ...current,
    name: patch.name ?? current.name,
    avatarUrl: patch.avatarUrl ?? current.avatarUrl,
  };
  useAuthStore.getState().setProfile(profile);
  return profile;
};
