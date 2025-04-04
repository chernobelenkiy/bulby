import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Rating,
  Chip,
  Collapse
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';

interface IdeaCardProps {
  idea: GeneratedIdea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
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
    <Card variant="outlined" sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" gutterBottom>
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
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {idea.description}
        </Typography>

        {/* Notes from different perspectives */}
        {(idea.dreamerNotes || idea.realistNotes || idea.criticNotes) && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Button
                size="small"
                endIcon={<ExpandMoreIcon 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} 
                />}
                onClick={toggleExpand}
              >
                {expanded ? 'Hide Details' : 'Show Details'}
              </Button>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                {idea.dreamerNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      Dreamer Notes:
                    </Typography>
                    <Typography variant="body2">
                      {idea.dreamerNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.realistNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="info.main">
                      Realist Notes:
                    </Typography>
                    <Typography variant="body2">
                      {idea.realistNotes}
                    </Typography>
                  </Box>
                )}
                
                {idea.criticNotes && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="error.main">
                      Critic Notes:
                    </Typography>
                    <Typography variant="body2">
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
            startIcon={isIdeasaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            onClick={handleSaveIdea}
            color={isIdeasaved ? "primary" : "inherit"}
          >
            {isIdeasaved ? "Saved" : "Save"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 