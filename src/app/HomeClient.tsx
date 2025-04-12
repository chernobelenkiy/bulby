'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Button,
  Paper,
  Box,
  useTheme,
  Divider,
  IconButton,
  alpha
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BoltIcon from '@mui/icons-material/Bolt';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import Link from 'next/link';

// Define the methods for the slider
const methodsForSlider = [
  {
    id: 'disney',
    icon: '🧠',
    translationKey: 'home.methods.disney'
  },
  {
    id: 'brainstorming',
    icon: '💡',
    translationKey: 'home.methods.brainstorming'
  },
  {
    id: 'scamper',
    icon: '🔄',
    translationKey: 'home.methods.scamper'
  },
  {
    id: 'sixHats',
    icon: '🎩',
    translationKey: 'home.methods.sixHats'
  }
];

export default function HomeClient() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeMethodIndex, setActiveMethodIndex] = useState(0);

  // Autoplay for the methods slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMethodIndex((prev) => (prev + 1) % methodsForSlider.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNextMethod = () => {
    setActiveMethodIndex((prev) => (prev + 1) % methodsForSlider.length);
  };

  const handlePrevMethod = () => {
    setActiveMethodIndex((prev) => (prev - 1 + methodsForSlider.length) % methodsForSlider.length);
  };

  const activeMethod = methodsForSlider[activeMethodIndex];

  return (
    <main>
      {/* Hero section with gradient background */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        <Container maxWidth="lg">
          <GridContainer spacing={6} alignItems="center">
            <GridItem xs={12} md={6}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  mb: 2, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  lineHeight: 1.2
                }}
              >
                {t('home.title')}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  fontWeight: 'normal',
                  maxWidth: '90%'
                }}
              >
                {t('home.subtitle')}
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
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.9)
                  },
                  boxShadow: theme.shadows[4]
                }}
              >
                {t('home.getStarted')}
              </Button>
            </GridItem>
          </GridContainer>
        </Container>
        
        {/* Wave divider */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            width: '100%'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
            style={{ display: 'block' }}
          >
            <path 
              fill={theme.palette.background.default} 
              fillOpacity="1" 
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,128C672,107,768,117,864,138.7C960,160,1056,192,1152,202.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </Box>
      </Box>

      {/* Features section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: { xs: 8, md: 10 } }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          {t('home.features.title')}
        </Typography>
        
        <Divider sx={{ width: '80px', mx: 'auto', mb: 6, borderColor: theme.palette.primary.main, borderWidth: 2 }} />
        
        <GridContainer spacing={4}>
          <GridItem xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex'
                  }}
                >
                  <BoltIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {t('home.features.ideaGeneration.title')}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {t('home.features.ideaGeneration.description')}
              </Typography>
            </Paper>
          </GridItem>
          
          <GridItem xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex'
                  }}
                >
                  <CategoryIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {t('home.features.organization.title')}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {t('home.features.organization.description')}
              </Typography>
            </Paper>
          </GridItem>
          
          <GridItem xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    p: 1.5,
                    mr: 2,
                    display: 'flex'
                  }}
                >
                  <GroupsIcon color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {t('home.features.collaboration.title')}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {t('home.features.collaboration.description')}
              </Typography>
            </Paper>
          </GridItem>
        </GridContainer>
      </Container>
      
      {/* Methods Slider Section */}
      <Box sx={{ 
        background: alpha(theme.palette.primary.light, 0.1),
        py: { xs: 6, md: 10 },
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
          >
            {t('home.methods.title')}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            {t('home.methods.subtitle')}
          </Typography>
          
          {/* Method Slider */}
          <Box sx={{ position: 'relative' }}>
            <IconButton 
              onClick={handlePrevMethod}
              sx={{ 
                position: 'absolute',
                left: { xs: -16, md: -24 },
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                },
                zIndex: 10
              }}
              aria-label="Previous method"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            
            <Box sx={{ 
              mx: 'auto', 
              maxWidth: '700px',
              px: { xs: 4, md: 0 }
            }}>
              <Paper 
                elevation={4}
                sx={{ 
                  p: 5,
                  borderRadius: 3,
                  borderTop: `5px solid ${theme.palette.primary.main}`,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 20,
                    fontSize: '4rem',
                    opacity: 0.08,
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    transform: 'translateY(-30%)'
                  }}
                >
                  {activeMethod.icon}
                </Typography>
                
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    mb: 3,
                    color: theme.palette.primary.main 
                  }}
                >
                  {t(`${activeMethod.translationKey}.title`)}
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                  {t(`${activeMethod.translationKey}.description`)}
                </Typography>
                
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3
                  }}
                >
                  {methodsForSlider.map((method, index) => (
                    <Box 
                      key={method.id}
                      component="span"
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        mx: 0.5,
                        backgroundColor: index === activeMethodIndex 
                          ? theme.palette.primary.main 
                          : alpha(theme.palette.primary.main, 0.3),
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveMethodIndex(index)}
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
            
            <IconButton 
              onClick={handleNextMethod}
              sx={{ 
                position: 'absolute',
                right: { xs: -16, md: -24 },
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                },
                zIndex: 10
              }}
              aria-label="Next method"
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative'
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              mb: 3,
              fontWeight: 'bold'
            }}
          >
            {t('promo.title')}
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 5,
              maxWidth: '700px',
              mx: 'auto',
              opacity: 0.9
            }}
          >
            {t('promo.description')}
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            href="/app"
            sx={{
              py: 1.5,
              px: 5,
              fontSize: '1.2rem',
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.9)
              },
              boxShadow: theme.shadows[4]
            }}
          >
            {t('promo.cta')}
          </Button>
        </Container>
      </Box>
    </main>
  );
} 