'use client';

import { useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TelegramLoginButton } from './TelegramLoginButton';
import { ITelegramUser } from './TelegramLoginButton';

interface TelegramLoginProps {
  botName: string;
}

export default function TelegramLogin({ botName }: TelegramLoginProps) {
  const router = useRouter();
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  // Handle successful Telegram login
  const handleTelegramLogin = useCallback(async (user: ITelegramUser) => {
    try {
      const result = await signIn('telegram-login', {
        redirect: false,
        ...user
      });
      
      if (result?.ok) {
        router.push('/');
      } else {
        console.error('Login failed:', result?.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [router]);
  
  // Determine the auth URL to use
  const authUrl = domain ? `${domain}/api/auth/callback/telegram-login` : undefined;

  // Common UI elements
  const renderLoginUI = (telegramButton: React.ReactNode) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Вход через Telegram
      </Typography>
      
      <Typography variant="body2" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Быстрый и безопасный вход с помощью вашего аккаунта Telegram
      </Typography>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center',
          borderRadius: 2,
          width: '100%',
          maxWidth: 320,
          backgroundColor: '#f5f5f5'
        }}
      >
        {telegramButton}
      </Paper>
    </Box>
  );

  // Use redirect URL or callback function based on domain availability
  if (authUrl) {
    return renderLoginUI(
      <TelegramLoginButton
        botName={botName}
        usePic={true}
        cornerRadius={12}
        requestAccess={true}
        buttonSize="large"
        dataAuthUrl={authUrl}
      />
    );
  }
  
  // Fall back to callback approach if no domain is configured
  return renderLoginUI(
    <TelegramLoginButton
      botName={botName}
      usePic={true}
      cornerRadius={12}
      requestAccess={true}
      buttonSize="large"
      dataOnauth={handleTelegramLogin}
    />
  );
} 