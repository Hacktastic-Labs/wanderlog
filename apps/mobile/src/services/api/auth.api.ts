import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import type {
  AppAuthSession,
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
} from '@/models/auth.model';
import { normalizeSession } from '@/models/auth.model';

class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function apiFetch<T>(path: string, options: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // Ignore invalid JSON bodies.
    }
    throw new AuthApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export const signIn = async (email: string, password: string): Promise<AppAuthSession> => {
  const payload: SignInRequest = { email, password };
  const response = await apiFetch<AuthApiSessionResponse>(API_ENDPOINTS.auth.signIn, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeSession(response);
};

export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiFetch<SignUpResponse>(API_ENDPOINTS.auth.signUp, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const sendPasswordReset = async (_email: string) => {
  // Not implemented on the backend yet.
  throw new Error('Password reset is not wired yet.');
};

export const signOut = async () => {
  // The backend currently issues stateless JWTs, so sign-out is a client-side
  // session wipe. This hook is kept here for future server-side revocation.
};

export const getSession = async (): Promise<AppAuthSession | null> => {
  // Stateless JWTs: the session is restored from the auth store. Returning null
  // here lets the store decide whether a persisted session is still valid.
  return null;
};

type AuthApiSessionResponse = Parameters<typeof normalizeSession>[0];
