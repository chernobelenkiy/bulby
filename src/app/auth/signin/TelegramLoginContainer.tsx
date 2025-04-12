'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ITelegramUser } from '@/types/telegram';


export default function TelegramLoginContainer() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inTelegramWebApp] = useState(() => window.Telegram?.WebApp);
  
  // Обработчик для успешной авторизации через Telegram Widget
  const handleTelegramAuth = async (user: ITelegramUser) => {
    try {
      console.log('📱 TelegramLogin: Received auth data from Telegram widget', user);
      setIsLoading(true);
      setError(null);
      
      // Используем данные от Telegram для входа через NextAuth
      const result = await signIn('telegram-login', {
        redirect: false,
        ...user
      });
      
      console.log('📱 TelegramLogin: SignIn result', result);
      
      if (result?.ok) {
        // Успешный вход, редирект на главную
        console.log('📱 TelegramLogin: Authentication successful, redirecting');
        router.push('/');
      } else {
        // Ошибка входа
        console.error('📱 TelegramLogin: Authentication failed', result?.error);
        setError(result?.error || 'Ошибка авторизации');
      }
    } catch (err) {
      console.error('📱 TelegramLogin: Error during sign in', err);
      setError('Произошла ошибка при попытке входа');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Инициализация Telegram Login Widget
  useEffect(() => {
  
    // Функция для обработки данных от Telegram Widget
    window.TelegramLoginWidget = {
      dataOnauth: handleTelegramAuth
    };
    
    // Создаем и добавляем скрипт виджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    
    // Настраиваем параметры виджета
    script.setAttribute('data-telegram-login', process.env.TELEGRAM_BOT_NAME || '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-lang', 'ru');
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    if (domain) {
      console.log('📱 TelegramLogin: Setting domain hint:', domain);
      script.setAttribute('data-domain-hint', domain);
    }
    
    // Добавляем скрипт на страницу
    const container = document.getElementById('telegram-login-container');
    if (container) {
      console.log('📱 TelegramLogin: Container found, appending script');
      container.appendChild(script);
    } else {
      console.error('📱 TelegramLogin: Container not found!');
    }
    
    // Очистка при размонтировании
    return () => {
      if (container && container.contains(script)) {
        console.log('📱 TelegramLogin: Cleaning up widget script');
        container.removeChild(script);
      }
    };
  }, []);
  
  if (inTelegramWebApp) {
    console.log('📱 TelegramLogin: In Telegram WebApp, not showing login button');
    return null;
  }
  
  // Если бот не сконфигурирован, показываем ошибку
  if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME) {
    console.error('📱 TelegramLogin: Bot name not configured');
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 3,
        color: 'error.main'
      }}>
        <Typography variant="body1">
          Ошибка конфигурации бота Telegram
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          NEXT_PUBLIC_TELEGRAM_BOT_NAME не указан
        </Typography>
      </Box>
    );
  }
  
  // Отображаем контейнер для кнопки Telegram Login
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isLoading ? (
        <CircularProgress size={30} />
      ) : (
        <>
          <div 
            id="telegram-login-container" 
            style={{ minHeight: 50 }} 
          />
          
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
} 