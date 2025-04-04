import { Container, Box, useTheme } from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import MethodSelector from './MethodSelector';
import ChatInterface from './ChatInterface';
import SavedIdeasList from './SavedIdeasList';

export default function IdeaGenerator() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        pt: 4,
        pb: 6
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: '1200px'
          }}
        >
          <GridContainer spacing={3}>
            {/* Method selection and saved ideas */}
            <GridItem xs={12} md={4}>
              <MethodSelector />
              <SavedIdeasList />
            </GridItem>
            
            {/* Chat area */}
            <GridItem xs={12} md={8}>
              <ChatInterface />
            </GridItem>
          </GridContainer>
        </Box>
      </Container>
    </Box>
  );
} 