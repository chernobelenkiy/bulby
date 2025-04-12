'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { 
  isTelegramWebApp, 
  initializeTelegramWebApp, 
  authenticateWithTelegramWebApp 
} from '@/lib/telegram/webapp';

/**
 * Компонент-провайдер для инициализации состояния пользователя
 * и авторизации Telegram WebApp
 */
export default function UserProvider({ children }: { children: ReactNode }) {
  const { fetchUser, isAuthenticated } = useUserStore();
  
  // Загружаем состояние пользователя при первом рендере
  useEffect(() => {
    console.log('🧑‍💻 UserProvider: Fetching user data');
    fetchUser();
  }, [fetchUser]);
  
  // Автоматическая авторизация в Telegram WebApp при загрузке
  useEffect(() => {
    // Проверяем, что мы в Telegram WebApp
    if (!isTelegramWebApp()) {
      console.log('🧑‍💻 UserProvider: Not in Telegram WebApp, skipping auto-auth');
      return;
    }
    
    // Проверяем, что пользователь не авторизован 
    if (isAuthenticated) {
      console.log('🧑‍💻 UserProvider: User already authenticated in WebApp');
      return;
    }
    
    console.log('🧑‍💻 UserProvider: Detected Telegram WebApp environment, starting auto-auth');
    
    // Инициализируем Telegram WebApp
    initializeTelegramWebApp();
    
    // Запускаем автоматическую авторизацию
    const autoAuth = async () => {
      try {
        console.log('🧑‍💻 UserProvider: Starting auto-auth process in WebApp');
        const success = await authenticateWithTelegramWebApp();
        if (success) {
          console.log('🧑‍💻 UserProvider: Auto-auth successful, refreshing user data');
          fetchUser(); // Обновляем данные пользователя после успешной авторизации
        } else {
          console.error('🧑‍💻 UserProvider: Auto-auth failed');
        }
      } catch (error) {
        console.error('🧑‍💻 UserProvider: Error during auto-auth:', error);
      }
    };
    
    // Запускаем авторизацию с небольшой задержкой для инициализации WebApp
    const timer = setTimeout(autoAuth, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, fetchUser]);
  
  return <>{children}</>;
} 