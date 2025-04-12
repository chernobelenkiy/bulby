'use client';

import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import TelegramLoginContainer from './TelegramLoginContainer';

export default function SignInClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if user is already signed in
  useEffect(() => {
    if (session) {
      console.log('📝 SignInPage: User already signed in, redirecting to home');
      router.push('/');
    }
  }, [session, router]);

  // Show loading while checking authentication status
  if (status === 'loading') {
    console.log('📝 SignInPage: Auth status is loading');
    return (
      <Container maxWidth="sm" sx={{ pt: 8, pb: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
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
          <TelegramLoginContainer />
        </Box>
      </Paper>
    </Container>
  );
} 