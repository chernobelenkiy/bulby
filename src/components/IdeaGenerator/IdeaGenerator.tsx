import { Container } from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import MethodSelector from './MethodSelector';
import ChatInterface from './ChatInterface';
import SavedIdeasList from './SavedIdeasList';

// Add fallback translations
const fallbackText = {
  generator: {
    title: "Idea Generator",
    selectMethod: "Select a method:"
  }
};

export default function IdeaGenerator() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <GridContainer spacing={3}>
        {/* Method selection and saved ideas */}
        <GridItem xs={12} md={4}>
          <MethodSelector fallbackText={fallbackText.generator} />
          <SavedIdeasList />
        </GridItem>
        
        {/* Chat area */}
        <GridItem xs={12} md={8}>
          <ChatInterface />
        </GridItem>
      </GridContainer>
    </Container>
  );
} 