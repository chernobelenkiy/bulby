'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function UserProvider({ children }: { children: ReactNode }) {
  const { 
    fetchUser, 
    isTelegramWebApp,
  } = useUserStore();
  

  useEffect(() => {
    window.Telegram?.WebApp?.ready();
    fetchUser();
  }, [fetchUser, isTelegramWebApp]);
  


  return <>{children}</>;
} 