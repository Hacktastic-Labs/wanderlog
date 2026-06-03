export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      visits: {
        Row: {
          id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          place_name: string;
          address: string | null;
          category: string;
          city: string | null;
          state: string | null;
          country: string | null;
          arrived_at: string;
          departed_at: string;
          duration_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          latitude: number;
          longitude: number;
          place_name: string;
          address?: string | null;
          category: string;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          arrived_at: string;
          departed_at: string;
          duration_minutes: number;
          created_at?: string;
        };
        Update: {
          latitude?: number;
          longitude?: number;
          place_name?: string;
          address?: string | null;
          category?: string;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          arrived_at?: string;
          departed_at?: string;
          duration_minutes?: number;
        };
      };
      location_points: {
        Row: {
          id: string;
          user_id: string;
          latitude: number;
          longitude: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          latitude: number;
          longitude: number;
          recorded_at: string;
        };
        Update: {
          latitude?: number;
          longitude?: number;
          recorded_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
