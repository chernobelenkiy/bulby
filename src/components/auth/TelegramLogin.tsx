'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { TelegramLoginButton, ITelegramUser } from './TelegramLoginButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TelegramLoginProps {
  botName: string;
}

export default function TelegramLogin({ botName }: TelegramLoginProps) {
  const router = useRouter();

  const handleTelegramLogin = async (telegramUser: ITelegramUser) => {
    try {
      // Convert the user data into URL search params format
      const searchParams = new URLSearchParams();
      Object.entries(telegramUser).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      // Sign in with telegram-login provider
      const result = await signIn('telegram-login', {
        callbackUrl: '/',
        redirect: false,
        ...Object.fromEntries(searchParams), // spread the user data as URL parameters
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        throw new Error(result.error);
      }

      // Redirect on successful login
      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
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
        <TelegramLoginButton
          botName={botName}
          usePic={true}
          cornerRadius={12}
          requestAccess={true}
          buttonSize="large"
          dataOnauth={handleTelegramLogin}
        />
      </Paper>
    </Box>
  );
} 