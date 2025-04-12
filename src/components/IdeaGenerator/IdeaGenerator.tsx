import { Container, Box, useTheme } from '@mui/material';
import MethodSelector from './MethodSelector';
import ChatInterface from './ChatInterface';
import SavedIdeasList from './SavedIdeasList';
import TokenStatus from './TokenStatus';

export default function IdeaGenerator() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        pt: 3,
        pb: 4
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Method selector centered at the top */}
        <Box sx={{ width: '100%', maxWidth: '450px', mb: 2 }}>
          <MethodSelector />
        </Box>
        
        {/* Token status */}
        <Box sx={{ width: '100%', maxWidth: '450px' }}>
          <TokenStatus />
        </Box>
        
        {/* Chat area */}
        <Box sx={{ width: '100%' }}>
          <ChatInterface />
        </Box>
        
        {/* Saved ideas list */}
        <Box sx={{ width: '100%', maxWidth: '450px', mt: 1.5 }}>
          <SavedIdeasList />
        </Box>
      </Container>
    </Box>
  );
} 