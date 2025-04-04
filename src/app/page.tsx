'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Button,
  Paper,
} from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import Link from 'next/link';

// Fallback translations for home page
const fallbackText = {
  home: {
    title: "Welcome to IdeaBulb",
    subtitle: "Turn your inspirations into reality",
    getStarted: "Get Started",
    features: {
      title: "Features",
      ideaGeneration: {
        title: "Idea Generation",
        description: "Generate ideas using AI and creative techniques"
      },
      organization: {
        title: "Organization",
        description: "Organize and categorize your ideas efficiently"
      },
      collaboration: {
        title: "Collaboration",
        description: "Share and collaborate on ideas with others"
      }
    }
  }
};

export default function Home() {
  const { t, i18n, ready } = useTranslation();
  
  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  return (
    <main>
      {/* Hero section */}
      <Container sx={{ py: 8 }}>
        <GridContainer spacing={6} alignItems="center">
          <GridItem xs={12} md={6}>
            <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              {getTranslation('home.title', fallbackText.home.title)}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {getTranslation('home.subtitle', fallbackText.home.subtitle)}
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              href="/app"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
              }}
            >
              {getTranslation('home.getStarted', fallbackText.home.getStarted)}
            </Button>
          </GridItem>
          <GridItem xs={12} md={6}>
            <div style={{ width: '100%', height: '300px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              {/* Placeholder for hero image */}
            </div>
          </GridItem>
        </GridContainer>
      </Container>

      {/* Features section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 6, textAlign: 'center' }}>
          {getTranslation('home.features.title', fallbackText.home.features.title)}
        </Typography>
        
        <GridContainer spacing={4}>
          <GridItem xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {getTranslation('home.features.ideaGeneration.title', fallbackText.home.features.ideaGeneration.title)}
              </Typography>
              <Typography variant="body1">
                {getTranslation('home.features.ideaGeneration.description', fallbackText.home.features.ideaGeneration.description)}
              </Typography>
            </Paper>
          </GridItem>
          
          <GridItem xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {getTranslation('home.features.organization.title', fallbackText.home.features.organization.title)}
              </Typography>
              <Typography variant="body1">
                {getTranslation('home.features.organization.description', fallbackText.home.features.organization.description)}
              </Typography>
            </Paper>
          </GridItem>
          
          <GridItem xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                {getTranslation('home.features.collaboration.title', fallbackText.home.features.collaboration.title)}
              </Typography>
              <Typography variant="body1">
                {getTranslation('home.features.collaboration.description', fallbackText.home.features.collaboration.description)}
              </Typography>
            </Paper>
          </GridItem>
        </GridContainer>
      </Container>
    </main>
  );
}
