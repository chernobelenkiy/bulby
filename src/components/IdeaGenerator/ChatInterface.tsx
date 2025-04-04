import { useState } from 'react';
import {
  Box,
  Paper,
  Divider,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';
import IdeaCard from './IdeaCard';
import { useTranslation } from 'react-i18next';

export default function ChatInterface() {
  const [chatMessage, setChatMessage] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();
  
  const messages = useIdeaGeneratorStore(state => state.messages);
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const isLoading = useIdeaGeneratorStore(state => state.isLoading);
  const generateIdeas = useIdeaGeneratorStore(state => state.generateIdeas);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedMethod) return;
    await generateIdeas(chatMessage, selectedMethod);
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '70vh',
        maxHeight: '800px',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Messages container */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 2,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '90%' }}>
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{ 
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                maxWidth: msg.isUser ? '80%' : '100%',
                width: msg.ideas && msg.ideas.length > 0 ? '100%' : 'auto'
              }}
            >
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  bgcolor: msg.isUser ? theme.palette.primary.main : theme.palette.background.paper,
                  color: msg.isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderRadius: 2,
                  boxShadow: 1
                }}
              >
                <Typography variant="body1">
                  {msg.text}
                </Typography>
                
                {/* Render ideas if present */}
                {msg.ideas && msg.ideas.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {msg.ideas.map((idea) => (
                      <IdeaCard key={idea.title} idea={idea} />
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={28} />
            </Box>
          )}
        </Stack>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Message input */}
      <Box sx={{ 
        display: 'flex', 
        p: 1,
        alignItems: 'center',
        width: '100%',
        maxWidth: '95%',
        mx: 'auto'
      }}>
        <TextField
          fullWidth
          placeholder={t('generator.prompt')}
          variant="outlined"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          sx={{ 
            mr: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
          disabled={isLoading || !selectedMethod}
        />
        <Button 
          variant="contained"
          color="primary"
          size="large"
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSendMessage}
          disabled={!chatMessage.trim() || !selectedMethod || isLoading}
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {isLoading ? t('generator.generating') : t('generator.send')}
        </Button>
      </Box>
    </Paper>
  );
} 