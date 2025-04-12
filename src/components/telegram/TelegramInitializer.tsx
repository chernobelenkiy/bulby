'use client';

import { useEffect } from "react";

export default function TelegramInitializer() {
  // Логируем и инициализируем WebApp при монтировании компонента
  useEffect(() => {
    console.log('🔄 TelegramInitializer mounted');
    if (typeof window !== 'undefined') {
      // Проверяем WebApp логику при загрузке
      console.log('🔄 Window location:', window.location.href);
      console.log('🔄 Telegram available:', !!window.Telegram);
      console.log('🔄 Telegram WebApp available:', !!window.Telegram?.WebApp);
      
      if (window.Telegram?.WebApp) {
        console.log('🔄 Telegram WebApp data:', {
          initData: window.Telegram.WebApp.initData,
          platform: window.Telegram.WebApp.platform,
        });
      }
    }
  }, []);
  
  // This component doesn't render anything
  return null;
} 