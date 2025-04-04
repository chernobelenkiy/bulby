import { 
  Typography, 
  Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  SelectChangeEvent,
  Box,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIdeaGeneratorStore, Method } from '@/stores/ideaGeneratorStore';

export default function MethodSelector() {
  const { t } = useTranslation();
  const theme = useTheme();
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const setSelectedMethod = useIdeaGeneratorStore(state => state.setSelectedMethod);
  const methods = useIdeaGeneratorStore(state => state.methods);

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setSelectedMethod(event.target.value);
  };

  // Find the selected method object
  const selectedMethodObj = methods.find(m => m.id === selectedMethod);

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          fontWeight="bold"
          color={theme.palette.primary.main}
        >
          {t('generator.title')}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('generator.selectMethod')}
        </Typography>
      </Box>
      
      <FormControl 
        fullWidth 
        sx={{ 
          mb: 3,
          maxWidth: '90%'
        }}
      >
        <InputLabel id="method-select-label">Method</InputLabel>
        <Select
          labelId="method-select-label"
          id="method-select"
          value={selectedMethod}
          label="Method"
          onChange={handleMethodChange}
          sx={{
            borderRadius: 1,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.light
            }
          }}
        >
          {methods.map((method: Method) => (
            <MenuItem key={method.id} value={method.id}>
              {method.nameKey ? t(method.nameKey) : method.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedMethod && selectedMethodObj && (
        <Card 
          variant="outlined" 
          sx={{ 
            width: '100%',
            maxWidth: '90%',
            borderRadius: 2,
            borderColor: theme.palette.primary.light,
            boxShadow: 1
          }}
        >
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom
              color={theme.palette.primary.main}
            >
              {selectedMethodObj.nameKey 
                ? t(selectedMethodObj.nameKey) 
                : selectedMethodObj.name}
            </Typography>
            <Typography variant="body2">
              {selectedMethodObj.descriptionKey 
                ? t(selectedMethodObj.descriptionKey) 
                : selectedMethodObj.description}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
} 