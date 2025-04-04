import {
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  Paper,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';
import { useTranslation } from 'react-i18next';

export default function SavedIdeasList() {
  const savedIdeas = useIdeaGeneratorStore(state => state.savedIdeas);
  const removeIdea = useIdeaGeneratorStore(state => state.removeIdea);
  const { t } = useTranslation();
  const theme = useTheme();

  if (savedIdeas.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          textAlign: 'center',
          fontWeight: 'medium',
          color: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <BookmarkIcon sx={{ mr: 1 }} />
        {t('generator.savedIdeas', { count: savedIdeas.length })}
      </Typography>
      
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          p: 2, 
          borderRadius: 2,
          borderColor: theme.palette.divider,
          maxHeight: '200px',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={1}>
          {savedIdeas.map((idea, index) => (
            <Card 
              key={index} 
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                borderColor: 'transparent',
                boxShadow: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ 
                py: 1, 
                px: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                '&:last-child': { pb: 1 }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                    {idea.title}
                  </Typography>
                  {idea.score && (
                    <Chip
                      size="small"
                      label={`${idea.score}/10`}
                      color={idea.score >= 7 ? "success" : idea.score >= 5 ? "primary" : "error"}
                      sx={{ mt: 0.5, width: 'fit-content' }}
                    />
                  )}
                </Box>
                <Tooltip title="Remove from saved">
                  <IconButton 
                    size="small" 
                    onClick={() => removeIdea(idea.title)}
                    color="error"
                    sx={{ 
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'rgba(211, 47, 47, 0.1)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
} 