'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@/store/userStore';
import { User } from '@/types/user';

export function useAuth() {
  const { 
    user, 
    isLoading, 
    error, 
    isAuthenticated,
    setUser,
    fetchUser,
    clearUser
  } = useUserStore();

  // Fetch user when the hook is first used
  useEffect(() => {
    if (!user && !isLoading && !error) {
      console.log('🔐 useAuth: No user data, fetching user');
      fetchUser();
    } else if (user) {
      console.log('🔐 useAuth: User already loaded:', user.id);
    } else if (isLoading) {
      console.log('🔐 useAuth: User data loading');
    } else if (error) {
      console.log('🔐 useAuth: Error loading user data:', error);
    }
  }, [user, isLoading, error, fetchUser]);

  /**
   * Sign out the user
   */
  const logout = async () => {
    try {
      console.log('🔐 useAuth: Signing out');
      await signOut({ redirect: false });
      clearUser();
      console.log('🔐 useAuth: Sign out successful');
      return true;
    } catch (error) {
      console.error('🔐 useAuth: Logout error:', error);
      return false;
    }
  };

  /**
   * Update user data in the store
   */
  const updateUser = (userData: User | null) => {
    console.log('🔐 useAuth: Updating user data:', userData?.id || 'null');
    setUser(userData);
  };
  
  /**
   * Refresh user data from the API
   */
  const refreshUser = async () => {
    console.log('🔐 useAuth: Refreshing user data');
    await fetchUser();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    logout,
    updateUser,
    refreshUser
  };
} 