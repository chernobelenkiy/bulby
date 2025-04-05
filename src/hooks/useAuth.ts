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
      fetchUser();
    }
  }, [user, isLoading, error, fetchUser]);

  /**
   * Sign out the user
   */
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      clearUser();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  /**
   * Update user data in the store
   */
  const updateUser = (userData: User | null) => {
    setUser(userData);
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    logout,
    updateUser,
    refreshUser: fetchUser
  };
} 