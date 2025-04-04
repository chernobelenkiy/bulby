'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import SendIcon from '@mui/icons-material/Send';

// Mock data for idea generation methods
const METHODS = [
  { id: 'brainstorming', name: 'Brainstorming', description: 'Generate as many ideas as possible without judgment' },
  { id: 'scamper', name: 'SCAMPER', description: 'Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse' },
  { id: 'sixHats', name: 'Six Thinking Hats', description: 'Look at the problem from different perspectives' },
  { id: 'mindMapping', name: 'Mind Mapping', description: 'Visually organize information to find connections' },
];

// Add fallback translations in the idea generator page (similar to Navigation)
const fallbackText = {
  generator: {
    title: "Idea Generator",
    selectMethod: "Select a method:"
  }
};

export default function IdeaGenerator() {
  const { t, i18n, ready } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hi there! I'm your AI assistant. I can help you generate ideas using different methods. Select a method to get started.", isUser: false },
  ]);

  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setSelectedMethod(event.target.value);
    
    // Add a message about the selected method
    const method = METHODS.find(m => m.id === event.target.value);
    if (method) {
      setMessages([...messages, {
        text: `You've selected the ${method.name} method. ${method.description}. What topic would you like to generate ideas for?`,
        isUser: false
      }]);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    const updatedMessages = [...messages, { text: chatMessage, isUser: true }];
    setMessages(updatedMessages);

    // Add dummy AI response
    setTimeout(() => {
      setMessages([...updatedMessages, {
        text: `Thanks for your message about "${chatMessage}". In a real implementation, I would generate ideas based on your input using the ${selectedMethod} method. For now, this is just a placeholder response.`,
        isUser: false
      }]);
    }, 1000);
    
    setChatMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <GridContainer spacing={3}>
        {/* Method selection */}
        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {getTranslation('generator.title', fallbackText.generator.title)}
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {getTranslation('generator.selectMethod', fallbackText.generator.selectMethod)}
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
        </GridItem>
        
        {/* Chat area */}
        <GridItem xs={12} md={8}>
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
                      maxWidth: '80%'
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
                    </Paper>
                  </Box>
                ))}
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
              />
              <Button 
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || !selectedMethod}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </GridItem>
      </GridContainer>
    </Container>
  );
} 