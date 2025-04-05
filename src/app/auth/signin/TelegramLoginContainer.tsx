'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

// Dynamically import the client component to avoid server/client mismatch
const TelegramLogin = dynamic(
  () => import('@/components/auth/TelegramLogin'),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 200 
      }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }
);

interface TelegramLoginContainerProps {
  botName: string;
}

// This component is just a container for the client-side TelegramLogin component
export default function TelegramLoginContainer({ botName }: TelegramLoginContainerProps) {
  if (!botName) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 3,
        color: 'error.main'
      }}>
        Ошибка конфигурации бота Telegram
      </Box>
    );
  }
  
  return <TelegramLogin botName={botName} />;
} 