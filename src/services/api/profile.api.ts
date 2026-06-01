import { getSupabaseClient } from '@/lib/supabase';
import type { UserProfile } from '@/types/domain';

const mapProfile = (row: {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}): UserProfile => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
  createdAt: row.created_at,
});

export const fetchProfile = async (userId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
};

export const upsertProfile = async (payload: {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        avatar_url: payload.avatarUrl ?? null,
      },
      {
        onConflict: 'id',
      },
    )
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
};

export const updateProfile = async (userId: string, patch: { name?: string; avatarUrl?: string }) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .update({
      name: patch.name,
      avatar_url: patch.avatarUrl,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data);
};
