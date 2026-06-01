import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
    getSession,
    sendPasswordReset,
    signIn as signInApi,
    signOut as signOutApi,
    signUp as signUpApi,
} from '@/services/api/auth.api';
import { fetchProfile, upsertProfile } from '@/services/api/profile.api';

import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { UserProfile } from '@/types/domain';

const isMissingUsersTableError = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: string }).code === 'PGRST205';

const buildFallbackProfile = (sessionUser: {
  id: string;
  email?: string | null;
  user_metadata?: { name?: string };
}): UserProfile => ({
  id: sessionUser.id,
  email: sessionUser.email ?? '',
  name: sessionUser.user_metadata?.name ?? 'Explorer',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
});

type AuthState = {
  session: Session | null;
  profile: UserProfile | null;
  isBootstrapping: boolean;
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { name: string; email: string; password: string }) => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
};

let authSubscriptionBound = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      profile: null,
      isBootstrapping: true,
      bootstrap: async () => {
        if (!isSupabaseConfigured) {
          set({ session: null, profile: null, isBootstrapping: false });
          return;
        }

        const session = await getSession();
        let profile: UserProfile | null = null;

        if (session?.user) {
          try {
            profile = await fetchProfile(session.user.id);
          } catch (error) {
            if (isMissingUsersTableError(error)) {
              profile = buildFallbackProfile(session.user);
            } else {
              try {
                profile = await upsertProfile({
                  id: session.user.id,
                  email: session.user.email ?? '',
                  name: (session.user.user_metadata?.name as string | undefined) ?? 'Explorer',
                });
              } catch {
                profile = buildFallbackProfile(session.user);
              }
            }
          }
        }

        set({ session, profile, isBootstrapping: false });

        if (!authSubscriptionBound) {
          authSubscriptionBound = true;
          const supabase = getSupabaseClient();
          supabase.auth.onAuthStateChange(async (_event, nextSession) => {
            let nextProfile: UserProfile | null = null;
            if (nextSession?.user) {
              try {
                nextProfile = await fetchProfile(nextSession.user.id);
              } catch (error) {
                if (isMissingUsersTableError(error)) {
                  nextProfile = buildFallbackProfile(nextSession.user);
                } else {
                  try {
                    nextProfile = await upsertProfile({
                      id: nextSession.user.id,
                      email: nextSession.user.email ?? '',
                      name:
                        (nextSession.user.user_metadata?.name as string | undefined) ??
                        get().profile?.name ??
                        'Explorer',
                    });
                  } catch {
                    nextProfile = buildFallbackProfile(nextSession.user);
                  }
                }
              }
            }
            set({ session: nextSession, profile: nextProfile, isBootstrapping: false });
          });
        }
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
