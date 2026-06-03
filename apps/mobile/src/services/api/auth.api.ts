import type { Session } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/lib/supabase';

export const getSession = async (): Promise<Session | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
};

export const signIn = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  return data.session;
};

export const signUp = async (name: string, email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
};

export const sendPasswordReset = async (email: string) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    throw error;
  }
};

export const signOut = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
