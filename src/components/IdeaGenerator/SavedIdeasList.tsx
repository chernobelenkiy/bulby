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
import { useIdeaGeneratorStore } from '@/store/ideaGeneratorStore';
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
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 2 }} />
      
      <Typography 
        variant="subtitle1" 
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
        <BookmarkIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
        {t('generator.savedIdeas', { count: savedIdeas.length })}
      </Typography>
      
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          p: 1.5, 
          borderRadius: 2,
          borderColor: theme.palette.divider,
          maxHeight: '180px',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={0.75}>
          {savedIdeas.map((idea, index) => (
            <Card 
              key={index} 
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                borderColor: 'transparent',
                boxShadow: 0,
                bgcolor: theme.palette.background.default,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <CardContent sx={{ 
                py: 0.75, 
                px: 1.5, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                '&:last-child': { pb: 0.75 }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {idea.title}
                  </Typography>
                  {idea.score && (
                    <Chip
                      size="small"
                      label={`${idea.score}/10`}
                      color={idea.score >= 7 ? "success" : idea.score >= 5 ? "primary" : "error"}
                      sx={{ mt: 0.5, width: 'fit-content', height: '20px', '& .MuiChip-label': { px: 1, py: 0 } }}
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
                      padding: 0.5,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: 'rgba(211, 47, 47, 0.1)'
                      }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: '0.9rem' }} />
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