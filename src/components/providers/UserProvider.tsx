'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import dynamic from 'next/dynamic';

// Dynamically import the TelegramWebAppAuth component to prevent SSR issues
const TelegramWebAppAuth = dynamic(
  () => import('@/components/auth/TelegramWebAppAuth'),
  { ssr: false }
);

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
  
  return (
    <>
      <TelegramWebAppAuth />
      {children}
    </>
  );
} 