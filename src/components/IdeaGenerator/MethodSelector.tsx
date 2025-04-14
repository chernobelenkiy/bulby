"use client";
import { 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useIdeaGeneratorStore, Method } from '@/store/ideaGeneratorStore';

export default function MethodSelector() {
  const { t } = useTranslation();
  const theme = useTheme();
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const setSelectedMethod = useIdeaGeneratorStore(state => state.setSelectedMethod);
  const methods = useIdeaGeneratorStore(state => state.methods);

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setSelectedMethod(event.target.value);
  };

  return (
    <FormControl 
      sx={{ 
        width: '100%',
        maxWidth: '300px',
        mb: selectedMethod ? 2 : 0
      }}
    >
      <InputLabel id="method-select-label">{t('generator.selectMethod')}</InputLabel>
      
      <Select
        labelId="method-select-label"
        id="method-select"
        value={selectedMethod}
        label={t('generator.selectMethod')}
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
  );
} 