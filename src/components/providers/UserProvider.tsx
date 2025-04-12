'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { init, miniApp, useRawInitData } from '@telegram-apps/sdk-react';

export default function UserProvider({ children }: { children: ReactNode }) {
  const { fetchUser } = useUserStore();
  // Use the SDK's hook to get raw init data
  const initData = useRawInitData();
  
  // Initialize Telegram Mini App
  useEffect(() => {
    init();
    miniApp.mountSync();
  }, []);
  
  // Handle authentication using the SDK's init data
  useEffect(() => {
    if (!initData) {
      fetchUser();
      return;
    }

    // Use the initData from the SDK with tma prefix
    fetchUser(`tma ${initData}`);
  }, [initData, fetchUser]);

  return <>{children}</>;
} 