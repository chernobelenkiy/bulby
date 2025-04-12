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
        mb: 1.5, 
        position: 'relative',
        borderRadius: 1.5,
        overflow: 'hidden',
        borderColor: theme.palette.divider,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 1,
          borderColor: theme.palette.primary.light,
        }
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="subtitle1" 
            component="div" 
            gutterBottom
            fontWeight="medium"
            color={theme.palette.text.primary}
            sx={{ mb: 0.5 }}
          >
            {idea.title}
          </Typography>
          <Box display="flex" alignItems="center" sx={{ mt: 0.25 }}>
            <Rating 
              value={idea.score / 2} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{ fontSize: '0.9rem' }}
            />
            <Chip
              size="small"
              label={`${idea.score}/10`}
              color={idea.score >= 7 ? "success" : idea.score >= 5 ? "primary" : "error"}
              sx={{ ml: 0.5, height: '20px', '& .MuiChip-label': { px: 1, py: 0 } }}
            />
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 1.5,
            color: theme.palette.text.secondary
          }}
        >
          {idea.description}
        </Typography>

        {/* Method-specific details */}
        {(idea.dreamerNotes || idea.realistNotes || idea.criticNotes) && (
          <>
            <Divider sx={{ my: 0.75 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Button
                size="small"
                color="primary"
                endIcon={<ExpandMoreIcon 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                    fontSize: '1rem'
                  }} 
                />}
                onClick={toggleExpand}
                sx={{ py: 0, px: 1, minWidth: 'auto' }}
              >
                {expanded ? t('generator.hideDetails') : t('generator.showDetails')}
              </Button>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 1 }}>
                {idea.dreamerNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="primary" fontWeight="bold">
                      {selectedMethod === 'sixHats' && t('generator.methods.sixHats.yellowGreen')}
                      {selectedMethod === 'scamper' && t('generator.methods.scamper.technique')}
                      {selectedMethod === 'mindMapping' && t('generator.methods.mindMapping.insights')}
                      {selectedMethod === 'brainstorming' && t('generator.methods.brainstorming.ideas')}
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.primary.main}` }}>
                      {idea.dreamerNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.realistNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="info.main" fontWeight="bold">
                      {selectedMethod === 'sixHats' && t('generator.methods.sixHats.whiteBlue')}
                      {selectedMethod === 'scamper' && t('generator.methods.scamper.implementation')}
                      {selectedMethod === 'mindMapping' && t('generator.methods.mindMapping.applications')}
                      {selectedMethod === 'brainstorming' && t('generator.methods.brainstorming.applications')}
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.info.main}` }}>
                      {idea.realistNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.criticNotes && (
                  <Box sx={{ mb: 0.5 }}>
                    <Typography variant="caption" color="error.main" fontWeight="bold">
                      {selectedMethod === 'sixHats' && t('generator.methods.sixHats.blackRed')}
                      {selectedMethod === 'scamper' && t('generator.methods.scamper.challenges')}
                      {selectedMethod === 'mindMapping' && t('generator.methods.mindMapping.branches')}
                      {selectedMethod === 'brainstorming' && t('generator.methods.brainstorming.innovation')}
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
        
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            variant={isIdeasaved ? "contained" : "outlined"}
            startIcon={isIdeasaved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            onClick={handleSaveIdea}
            color="primary"
            sx={{ borderRadius: 4, py: 0.25, px: 1.5 }}
          >
            {isIdeasaved ? t('generator.saved') : t('generator.save')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 