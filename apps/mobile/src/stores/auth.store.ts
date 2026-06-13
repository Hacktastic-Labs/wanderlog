import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sendPasswordReset, signOut as signOutApi } from '@/services/api/auth.api';
import { AUTH_ENABLED, DEV_USER_ID, DEV_USER_PROFILE } from '@/constants/features';
import type { AppSession, UserProfile } from '@/types/domain';
import type { AppAuthSession } from '@/models/auth.model';

type AuthState = {
  session: AppSession | null;
  profile: UserProfile | null;
  isBootstrapping: boolean;
  bootstrap: () => Promise<void>;
  setSession: (session: AppAuthSession | null) => void;
  sendReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
};

const createDevSession = (): AppSession => ({
  accessToken: 'dev',
  user: {
    id: DEV_USER_ID,
    email: DEV_USER_PROFILE.email,
    name: DEV_USER_PROFILE.name,
    createdAt: DEV_USER_PROFILE.createdAt,
  },
});

export const selectUserId = (state: AuthState): string | null => {
  if (!AUTH_ENABLED) {
    return DEV_USER_ID;
  }
  return state.session?.user.id ?? null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      profile: null,
      isBootstrapping: true,
      bootstrap: async () => {
        if (!AUTH_ENABLED) {
          set({
            session: createDevSession(),
            profile: DEV_USER_PROFILE,
            isBootstrapping: false,
          });
          return;
        }

        // When AUTH_ENABLED is true the persisted session is rehydrated by
        // zustand. We just mark bootstrap complete here.
        set({ isBootstrapping: false });
      },
      setSession: (session) => {
        if (!session) {
          set({ session: null });
          return;
        }
        const appSession: AppSession = {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            createdAt: session.user.createdAt,
          },
        };
        set({ session: appSession });
      },
      sendReset: async (email) => {
        await sendPasswordReset(email);
      },
      signOut: async () => {
        await signOutApi();
        set({ session: null, profile: null });
      },
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'wanderlog-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
      }),
    },
  ),
);
