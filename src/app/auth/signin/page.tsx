'use client';

import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  const { t } = useTranslation();

  // For now, this is a dummy login with Telegram
  const handleTelegramLogin = () => {
    // In a real application, you would implement Telegram authentication
    // For now, let's just simulate a login with dummy values
    signIn('credentials', {
      telegramId: '123456789',
      name: 'Test User',
      callbackUrl: '/app'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          {t('auth.signInTitle')}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<TelegramIcon />}
            onClick={handleTelegramLogin}
            sx={{ 
              bgcolor: '#0088cc', 
              '&:hover': { bgcolor: '#0077b5' },
              py: 1.5
            }}
          >
            {t('auth.telegramLogin')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 