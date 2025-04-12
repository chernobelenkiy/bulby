'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTelegramWebApp, authenticateWithTelegramWebApp } from '@/lib/telegram/webapp';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function TelegramWebAppAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Only attempt to authenticate if:
    // 1. We're in a Telegram WebApp
    // 2. User is not already authenticated
    // 3. We're not currently in the process of authenticating
    // 4. Authentication loading state is complete
    if (isTelegramWebApp() && !isAuthenticated && !isAuthenticating && !isLoading) {
      const authenticate = async () => {
        try {
          setIsAuthenticating(true);
          setError(null);
          
          const success = await authenticateWithTelegramWebApp();
          
          if (success) {
            // Redirect to the home page or refresh the current page
            router.refresh();
          } else {
            setError('Failed to authenticate with Telegram');
          }
        } catch (err) {
          console.error('Error during Telegram WebApp authentication:', err);
          setError('An error occurred during authentication');
        } finally {
          setIsAuthenticating(false);
        }
      };
      
      authenticate();
    }
  }, [isAuthenticated, isAuthenticating, isLoading, router]);
  
  // Don't render anything if not in Telegram WebApp or already authenticated
  if (!isTelegramWebApp() || isAuthenticated) {
    return null;
  }
  
  // Show loading state
  if (isAuthenticating || isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 2
      }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Authenticating...
        </Typography>
      </Box>
    );
  }
  
  // Show error if authentication failed
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 2,
        color: 'error.main'
      }}>
        <Typography variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }
  
  return null;
} 