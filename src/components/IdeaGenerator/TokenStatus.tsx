import { Box, Typography, Tooltip, Chip } from '@mui/material';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { METHOD_COSTS } from '@/lib/tokenManager';

export default function TokenStatus() {
  const { t } = useTranslation();
  const { tokenBalance, refreshTokenBalance, selectedMethod } = useIdeaGeneratorStore();
  
  // Get the cost of the selected method
  const methodCost = selectedMethod ? 
    METHOD_COSTS[selectedMethod as keyof typeof METHOD_COSTS] || 10 : 0;
  
  // Refresh token balance on component mount and when the component is visible
  useEffect(() => {
    refreshTokenBalance();
    
    // Refresh tokens if tab becomes active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshTokenBalance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshTokenBalance]);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 2 }}>
      <Tooltip title={t('generator.dailyLimit')} arrow>
        <Typography variant="body2" color="text.secondary">
          {t('generator.tokens', { balance: tokenBalance })}
        </Typography>
      </Tooltip>
      
      {selectedMethod && (
        <Tooltip title={methodCost > tokenBalance ? t('generator.notEnoughTokens', { cost: methodCost }) : ''} arrow>
          <Chip 
            size="small" 
            label={t('generator.tokenCost', { cost: methodCost })}
            color={methodCost > tokenBalance ? "error" : "primary"}
            variant="outlined"
          />
        </Tooltip>
      )}
    </Box>
  );
} 