import {
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';

export default function SavedIdeasList() {
  const savedIdeas = useIdeaGeneratorStore(state => state.savedIdeas);
  const removeIdea = useIdeaGeneratorStore(state => state.removeIdea);

  if (savedIdeas.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Saved Ideas ({savedIdeas.length})
      </Typography>
      <Stack spacing={1}>
        {savedIdeas.map((idea, index) => (
          <Card key={index} variant="outlined">
            <CardContent sx={{ py: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                {idea.title}
              </Typography>
              <Tooltip title="Remove from saved">
                <IconButton 
                  size="small" 
                  onClick={() => removeIdea(idea.title)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
} 