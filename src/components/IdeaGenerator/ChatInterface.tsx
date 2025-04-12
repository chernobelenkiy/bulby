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
  useTheme,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useIdeaGeneratorStore } from '@/store/ideaGeneratorStore';
import IdeaCard from './IdeaCard';
import { useTranslation } from 'react-i18next';
import { hasEnoughTokens, METHOD_COSTS } from '@/lib/tokenManager';

export default function ChatInterface() {
  const [chatMessage, setChatMessage] = useState('');
  const { t } = useTranslation();
  const theme = useTheme();
  
  const messages = useIdeaGeneratorStore(state => state.messages);
  const selectedMethod = useIdeaGeneratorStore(state => state.selectedMethod);
  const isLoading = useIdeaGeneratorStore(state => state.isLoading);
  const generateIdeas = useIdeaGeneratorStore(state => state.generateIdeas);

  const hasTokens = selectedMethod ? hasEnoughTokens(selectedMethod) : true;
  const methodCost = selectedMethod ? METHOD_COSTS[selectedMethod as keyof typeof METHOD_COSTS] || 10 : 0;

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedMethod || !hasTokens) return;
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
      elevation={2}
      sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '65vh',
        maxHeight: '700px',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Messages container */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 1.5,
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Stack spacing={1.5} sx={{ width: '100%', maxWidth: '95%' }}>
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{ 
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                maxWidth: msg.isUser ? '80%' : '100%',
                width: msg.ideas && msg.ideas.length > 0 ? '100%' : 'auto'
              }}
            >
              {msg.isMethodDescription ? (
                <Card 
                  elevation={2}
                  sx={{ 
                    width: '100%', 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.primary.light}`,
                    bgcolor: theme.palette.background.default,
                    mb: 1
                  }}
                >
                  <CardContent sx={{ pb: '12px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {msg.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: msg.isUser ? theme.palette.primary.main : theme.palette.background.paper,
                    color: msg.isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderRadius: 2,
                    boxShadow: 0
                  }}
                >
                  <Typography variant="body2">
                    {msg.text}
                  </Typography>
                  
                  {/* Render ideas if present */}
                  {msg.ideas && msg.ideas.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      {msg.ideas.map((idea) => (
                        <IdeaCard key={idea.title} idea={idea} />
                      ))}
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Stack>
      </Box>
      
      <Divider sx={{ mb: 1.5 }} />
      
      {/* Message input */}
      <Box sx={{ 
        display: 'flex', 
        p: 0.5,
        alignItems: 'center',
        width: '100%',
        maxWidth: '98%',
        mx: 'auto'
      }}>
        <Tooltip 
          title={selectedMethod && !hasTokens 
            ? t('generator.notEnoughTokens', { cost: methodCost }) 
            : ''}
          arrow
          placement="top"
        >
          <TextField
            fullWidth
            placeholder={t('generator.prompt')}
            variant="outlined"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={2}
            sx={{ 
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5
              }
            }}
            disabled={isLoading || !selectedMethod || !hasTokens}
          />
        </Tooltip>
        <Button 
          variant="contained"
          color="primary"
          size="medium"
          endIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          onClick={handleSendMessage}
          disabled={!chatMessage.trim() || !selectedMethod || isLoading || !hasTokens}
          sx={{ 
            borderRadius: 1.5,
            px: 2,
            py: 1
          }}
        />
      </Box>
    </Paper>
  );
} 