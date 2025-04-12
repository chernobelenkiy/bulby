'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  isTelegramWebApp, 
  authenticateWithTelegramWebApp, 
  initializeTelegramWebApp,
  getTelegramWebApp,
  extractTelegramUserData,
  parseUrlForTelegramData
} from '@/lib/telegram/webapp';
import { useAuth } from '@/hooks/useAuth';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

interface DebugData {
  platform?: string;
  isExpanded?: boolean;
  hasInitData: boolean;
  hasUser: boolean;
  user: {
    id: number;
    first_name: string;
  } | null;
  urlParams?: Record<string, string> | null;
}

export default function TelegramWebAppAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'initializing' | 'authenticating' | 'error' | 'success'>('idle');
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  
  // One useEffect to rule them all - simplify the logic
  useEffect(() => {
    // Skip if not in Telegram WebApp
    if (!isTelegramWebApp()) {
      console.log('🔵 TelegramWebAppAuth: Not in Telegram WebApp, exiting');
      return;
    }
    
    // Skip if already authenticated
    if (isAuthenticated) {
      console.log('🔵 TelegramWebAppAuth: Already authenticated, exiting');
      return;
    }
    
    // Skip if still loading auth state
    if (isLoading) {
      console.log('🔵 TelegramWebAppAuth: Auth state still loading, waiting');
      return;
    }
    
    // Skip if already in the process
    if (status !== 'idle') {
      console.log('🔵 TelegramWebAppAuth: Already processing, status:', status);
      return;
    }
    
    console.log('🔵 TelegramWebAppAuth: Starting WebApp authentication flow');
    
    // Start the auth process
    const authenticate = async () => {
      try {
        // First, initialize the WebApp
        setStatus('initializing');
        console.log('🔵 TelegramWebAppAuth: Initializing WebApp');
        initializeTelegramWebApp();
        
        // Collect debug data
        const webApp = getTelegramWebApp();
        const userData = extractTelegramUserData();
        const urlParams = parseUrlForTelegramData();
        
        // Собираем отладочную информацию со всех источников
        const debugInfo: DebugData = {
          platform: webApp?.platform,
          isExpanded: webApp?.isExpanded,
          hasInitData: !!webApp?.initData,
          hasUser: !!webApp?.initDataUnsafe?.user,
          user: userData 
            ? { 
                id: typeof userData.id === 'number' ? userData.id : parseInt(userData.id as string, 10),
                first_name: userData.first_name
              } 
            : null,
          urlParams: urlParams ? Object.entries(urlParams).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: String(value)
          }), {} as Record<string, string>) : null
        };
        
        console.log('🔵 TelegramWebAppAuth: Debug info:', debugInfo);
        setDebugData(debugInfo);
        
        // Wait a second to make sure WebApp is initialized
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Now authenticate
        setStatus('authenticating');
        console.log('🔵 TelegramWebAppAuth: Authenticating');
        const success = await authenticateWithTelegramWebApp();
        
        if (success) {
          setStatus('success');
          console.log('🔵 TelegramWebAppAuth: Authentication successful');
          refreshUser(); // Update the user state
          router.refresh(); // Update the page
        } else {
          setStatus('error');
          setError('Не удалось выполнить авторизацию через Telegram');
          console.error('🔵 TelegramWebAppAuth: Authentication failed');
        }
      } catch (err) {
        setStatus('error');
        console.error('🔵 TelegramWebAppAuth: Error in authentication flow:', err);
        setError(`Ошибка авторизации: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    authenticate();
  }, [isAuthenticated, isLoading, router, status, refreshUser]);
  
  // Handle retry
  const handleRetry = () => {
    setError(null);
    setStatus('idle');
  };
  
  // If not in Telegram WebApp, render nothing
  if (!isTelegramWebApp()) {
    return null;
  }
  
  // If authenticated, render nothing
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      p: 2, 
      maxWidth: '100%' 
    }}>
      {status === 'initializing' && (
        <>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Инициализация Telegram...
          </Typography>
        </>
      )}
      
      {status === 'authenticating' && (
        <>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Авторизация...
          </Typography>
        </>
      )}
      
      {status === 'error' && (
        <>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            onClick={handleRetry}
            sx={{ mt: 1 }}
          >
            Попробовать снова
          </Button>
          
          {debugData && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, maxWidth: '100%', overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                Debug: {JSON.stringify(debugData, null, 2)}
              </Typography>
            </Box>
          )}
        </>
      )}
      
      {status === 'success' && (
        <Typography variant="body2" color="success.main">
          Авторизация успешна!
        </Typography>
      )}
      
      {status === 'idle' && isLoading && (
        <>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Подготовка...
          </Typography>
        </>
      )}
    </Box>
  );
} 