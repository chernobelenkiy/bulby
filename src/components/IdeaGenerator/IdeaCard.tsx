import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Rating,
  Chip,
  Collapse,
  Divider,
  useTheme
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';
import { useTranslation } from 'react-i18next';

interface IdeaCardProps {
  idea: GeneratedIdea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const savedIdeas = useIdeaGeneratorStore(state => state.savedIdeas);
  const saveIdea = useIdeaGeneratorStore(state => state.saveIdea);

  const isIdeasaved = savedIdeas.some(
    savedIdea => savedIdea.title === idea.title
  );

  const handleSaveIdea = () => {
    saveIdea(idea, selectedMethod);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        borderColor: theme.palette.divider,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          borderColor: theme.palette.primary.light,
        }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom
            fontWeight="medium"
            color={theme.palette.text.primary}
          >
            {idea.title}
          </Typography>
          <Box display="flex" alignItems="center">
            <Rating 
              value={idea.score / 2} 
              precision={0.5} 
              readOnly 
              size="small"
            />
            <Chip
              size="small"
              label={`${idea.score}/10`}
              color={idea.score >= 7 ? "success" : idea.score >= 5 ? "primary" : "error"}
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2,
            color: theme.palette.text.secondary
          }}
        >
          {idea.description}
        </Typography>

        {/* Notes from different perspectives */}
        {(idea.dreamerNotes || idea.realistNotes || idea.criticNotes) && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Button
                size="small"
                color="primary"
                endIcon={<ExpandMoreIcon 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} 
                />}
                onClick={toggleExpand}
              >
                {expanded ? t('generator.hideDetails') : t('generator.showDetails')}
              </Button>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                {idea.dreamerNotes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                      {t('generator.dreamerNotes')}
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.primary.main}` }}>
                      {idea.dreamerNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.realistNotes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="info.main" fontWeight="bold">
                      {t('generator.realistNotes')}
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.info.main}` }}>
                      {idea.realistNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.criticNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="error.main" fontWeight="bold">
                      {t('generator.criticNotes')}
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.error.main}` }}>
                      {idea.criticNotes}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant={isIdeasaved ? "contained" : "outlined"}
            startIcon={isIdeasaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            onClick={handleSaveIdea}
            color="primary"
            sx={{ borderRadius: 4 }}
          >
            {isIdeasaved ? t('generator.saved') : t('generator.save')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 