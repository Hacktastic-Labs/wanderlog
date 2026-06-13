/**
 * Auth models mirrored from `apps/backend/internal/auth/types.go`.
 *
 * Backend request shapes:
 *   UserSignUpRequest: { email, password, username, display_name }
 *   UserSignInRequest: { email, password }
 *
 * Responses come from the supabase auth-go client and are normalised into the
 * client-side session shape below.
 */

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  username: string;
  display_name: string;
};

/** Subset of the supabase `User` struct that the mobile app cares about. */
export type AuthUser = {
  id: string;
  email: string;
  created_at: string;
};

/** Subset of the supabase `Session` struct returned by sign-in. */
export type AuthSessionResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  user: AuthUser;
};

/**
 * Sign-up response: when auto-confirm is enabled the backend returns a
 * session; otherwise only the user is returned and the user must verify
 * their email before signing in.
 */
export type SignUpResponse = {
  user: AuthUser;
  session?: AuthSessionResponse;
};

/** Normalised client session written to the auth store. */
export type AppAuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
  user: {
    id: string;
    email: string;
    name?: string;
    createdAt: string;
  };
};

export function normalizeSession(response: AuthSessionResponse): AppAuthSession {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    expiresAt: response.expires_at,
    user: {
      id: response.user.id,
      email: response.user.email,
      createdAt: response.user.created_at,
    },
  };
}
