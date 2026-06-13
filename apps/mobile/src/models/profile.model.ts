/**
 * Frontend profile view model.
 *
 * These fields will be populated from the backend later. For now we use
 * placeholder values so the UI can be built and styled independently.
 */

export type ProfileStats = {
  likes: string;
  posts: string;
  views: string;
};

export type ProfileView = {
  id: string;
  name: string;
  handle?: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  isVerified?: boolean;
  stats: ProfileStats;
};

/**
 * Stub profile used until the backend profile endpoint is wired.
 */
export const PLACEHOLDER_PROFILE: ProfileView = {
  id: '00000000-0000-4000-8000-000000000000',
  name: 'Aria Davies',
  handle: '@ariadavies',
  bio: 'Transforming ideas into innovative, simple, and meaningful digital solutions.',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  coverUrl: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=400&fit=crop',
  isVerified: true,
  stats: {
    likes: '104K',
    posts: '1.2K',
    views: '678K',
  },
};
