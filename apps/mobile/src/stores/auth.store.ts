import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  sendPasswordReset,
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from '@/services/api/auth.api';
import { AUTH_ENABLED, DEV_USER_ID, DEV_USER_PROFILE } from '@/constants/features';
import type { AppSession, UserProfile } from '@/types/domain';

type AuthState = {
  session: AppSession | null;
  profile: UserProfile | null;
  isBootstrapping: boolean;
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>;
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

        set({ session: null, profile: null, isBootstrapping: false });
      },
      signIn: async (email, password) => {
        await signInApi(email, password);
      },
      signUp: async ({ name, email, password }) => {
        await signUpApi(name, email, password);
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
        profile: state.profile,
      }),
    },
  ),
);
