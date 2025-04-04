import { 
  Typography, 
  Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';

// Method data 
const METHODS = [
  { id: 'brainstorming', name: 'Brainstorming', description: 'Generate as many ideas as possible without judgment' },
  { id: 'scamper', name: 'SCAMPER', description: 'Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse' },
  { id: 'sixHats', name: 'Six Thinking Hats', description: 'Look at the problem from different perspectives' },
  { id: 'mindMapping', name: 'Mind Mapping', description: 'Visually organize information to find connections' },
  { id: 'disney', name: 'Disney Method', description: 'Analyze ideas from three perspectives: Dreamer, Realist, and Critic' },
];

interface MethodSelectorProps {
  fallbackText?: {
    title: string;
    selectMethod: string;
  };
}

export default function MethodSelector({ fallbackText }: MethodSelectorProps) {
  const { t, i18n, ready } = useTranslation();
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const setSelectedMethod = useIdeaGeneratorStore(state => state.setSelectedMethod);

  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setSelectedMethod(event.target.value);
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {getTranslation(
          'generator.title', 
          fallbackText?.title || "Idea Generator"
        )}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        {getTranslation(
          'generator.selectMethod', 
          fallbackText?.selectMethod || "Select a method:"
        )}
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="method-select-label">Method</InputLabel>
        <Select
          labelId="method-select-label"
          id="method-select"
          value={selectedMethod}
          label="Method"
          onChange={handleMethodChange}
        >
          {METHODS.map(method => (
            <MenuItem key={method.id} value={method.id}>
              {method.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedMethod && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {METHODS.find(m => m.id === selectedMethod)?.name}
            </Typography>
            <Typography variant="body2">
              {METHODS.find(m => m.id === selectedMethod)?.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
} 