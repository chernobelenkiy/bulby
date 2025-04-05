'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes the user authentication state
 * Place this at the root of your application
 */
export default function UserProvider({ children }: UserProviderProps) {
  const { fetchUser } = useUserStore();
  
  // Initialize user state when the application loads
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  return <>{children}</>;
} 