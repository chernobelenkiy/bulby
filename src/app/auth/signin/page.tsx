'use client';

import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TelegramLoginContainer from './TelegramLoginContainer';
import { isTelegramWebApp } from '@/lib/telegram/webapp';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [botName, setBotName] = useState<string | null>(null);
  
  // Fetch bot name on component mount
  useEffect(() => {
    // Get Telegram bot name from environment variables (client-side)
    const name = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
    console.log('📝 SignInPage: NEXT_PUBLIC_TELEGRAM_BOT_NAME =', name);
    
    if (!name) {
      console.error('📝 SignInPage: NEXT_PUBLIC_TELEGRAM_BOT_NAME environment variable is not set');
    }
    
    setBotName(name || '');
  }, []);
  
  // Redirect if user is already signed in
  useEffect(() => {
    if (session) {
      console.log('📝 SignInPage: User already signed in, redirecting to home');
      router.push('/');
    }
  }, [session, router]);
  
  // If we're in the Telegram WebApp, show a different UI
  const isInTelegramWebApp = isTelegramWebApp();
  
  // Show loading while checking authentication status
  if (status === 'loading') {
    console.log('📝 SignInPage: Auth status is loading');
    return (
      <Container maxWidth="sm" sx={{ pt: 8, pb: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  // If we're in Telegram WebApp, show a message that authentication is automatic
  if (isInTelegramWebApp) {
    console.log('📝 SignInPage: Detected Telegram WebApp, showing WebApp auth UI');
    return (
      <Container maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Авторизация через Telegram
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Авторизация в Telegram WebApp происходит автоматически
          </Typography>
          
          <CircularProgress size={30} />
        </Paper>
      </Container>
    );
  }

  console.log('📝 SignInPage: Showing regular login UI with botName =', botName);
  return (
    <Container maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Вход
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Войдите с помощью Telegram для продолжения
        </Typography>
        
        {/* Telegram login section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          {botName ? (
            <TelegramLoginContainer botName={botName} />
          ) : (
            <CircularProgress size={30} />
          )}
        </Box>
      </Paper>
    </Container>
  );
} 