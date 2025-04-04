import { useState } from 'react';
import {
  Box,
  Paper,
  Divider,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useIdeaGeneratorStore } from '@/stores/ideaGeneratorStore';
import IdeaCard from './IdeaCard';

export default function ChatInterface() {
  const [chatMessage, setChatMessage] = useState('');
  
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
    <Paper sx={{ 
      p: 2, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '70vh',
      maxHeight: '800px'
    }}>
      {/* Messages container */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 2,
        p: 1
      }}>
        <Stack spacing={2}>
          {messages.map((msg, index) => (
            <Box 
              key={index} 
              sx={{ 
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                maxWidth: msg.isUser ? '80%' : '100%'
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: msg.isUser ? 'primary.light' : 'grey.100',
                  color: msg.isUser ? 'white' : 'text.primary',
                  borderRadius: 2,
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
              <CircularProgress size={24} />
            </Box>
          )}
        </Stack>
      </Box>
      
      <Divider />
      
      {/* Message input */}
      <Box sx={{ 
        display: 'flex', 
        p: 1,
        alignItems: 'center'
      }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          sx={{ mr: 1 }}
          disabled={isLoading || !selectedMethod}
        />
        <Button 
          variant="contained"
          color="primary"
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSendMessage}
          disabled={!chatMessage.trim() || !selectedMethod || isLoading}
        >
          {isLoading ? 'Generating' : 'Send'}
        </Button>
      </Box>
    </Paper>
  );
} 