import { useMutation } from '@tanstack/react-query';

import { signIn as signInApi, signUp as signUpApi } from '@/services/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { normalizeSession } from '@/models/auth.model';

export type SignInVariables = {
  email: string;
  password: string;
};

export function useSignInMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: ({ email, password }: SignInVariables) => signInApi(email, password),
    onSuccess: (session) => {
      setSession(session);
      setProfile({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? session.user.email.split('@')[0],
        avatarUrl: null,
        createdAt: session.user.createdAt,
      });
    },
  });
}

export function useSignUpMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: (response, variables) => {
      // When auto-confirm is enabled the backend returns a session; sign the
      // user in immediately. Otherwise they must verify their email first.
      if (response.session) {
        setSession(normalizeSession(response.session));
      }
      setProfile({
        id: response.user.id,
        email: response.user.email,
        name: variables.display_name,
        avatarUrl: null,
        createdAt: response.user.created_at,
      });
    },
  });
}
