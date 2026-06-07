import type { AppSession } from '@/types/domain';

const notConfigured = () =>
  new Error('Server auth is not wired yet. Keep AUTH_ENABLED false or connect apps/backend.');

export const getSession = async (): Promise<AppSession | null> => {
  throw notConfigured();
};

export const signIn = async (_email: string, _password: string) => {
  throw notConfigured();
};

export const signUp = async (_name: string, _email: string, _password: string) => {
  throw notConfigured();
};

export const sendPasswordReset = async (_email: string) => {
  throw notConfigured();
};

export const signOut = async () => {
  throw notConfigured();
};
