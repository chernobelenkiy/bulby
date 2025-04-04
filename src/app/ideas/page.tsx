'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { format } from 'date-fns';

// Mock data for saved ideas
const DUMMY_IDEAS = [
  {
    id: '1',
    title: 'Mobile App for Plant Care',
    description: 'An app that uses AI to identify plant diseases and provide care instructions based on photos.',
    createdAt: new Date('2023-07-15'),
    method: 'brainstorming'
  },
  {
    id: '2',
    title: 'Sustainable Food Packaging',
    description: 'Biodegradable food packaging made from agricultural waste that decomposes within 30 days.',
    createdAt: new Date('2023-08-22'),
    method: 'scamper'
  },
  {
    id: '3',
    title: 'Virtual Reality Meditation Space',
    description: 'A VR environment that creates personalized meditation spaces based on user preferences and stress levels.',
    createdAt: new Date('2023-09-05'),
    method: 'mindMapping'
  }
];

export default function IdeasPage() {
  const { t } = useTranslation();
  const [ideas, setIdeas] = useState(DUMMY_IDEAS);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<(typeof DUMMY_IDEAS)[0] | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  const handleEditOpen = (idea: typeof DUMMY_IDEAS[0]) => {
    setCurrentIdea(idea);
    setEditedTitle(idea.title);
    setEditedDescription(idea.description);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditSave = () => {
    if (!currentIdea) return;
    
    const updatedIdeas = ideas.map(idea => 
      idea.id === currentIdea.id ? { ...idea, title: editedTitle, description: editedDescription } : idea
    );
    
    setIdeas(updatedIdeas);
    setOpenEdit(false);
  };

  const handleDeleteOpen = (idea: typeof DUMMY_IDEAS[0]) => {
    setCurrentIdea(idea);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDeleteConfirm = () => {
    if (!currentIdea) return;
    
    const updatedIdeas = ideas.filter(idea => idea.id !== currentIdea.id);
    setIdeas(updatedIdeas);
    setOpenDelete(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {t('ideas.title')}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          href="/app"
        >
          {t('ideas.create')}
        </Button>
      </Box>
      
      {ideas.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('ideas.noIdeas')}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            href="/app"
          >
            {t('ideas.create')}
          </Button>
        </Paper>
      ) : (
        <GridContainer spacing={3}>
          {ideas.map(idea => (
            <GridItem key={idea.id} xs={12} md={6} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {idea.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={idea.method.charAt(0).toUpperCase() + idea.method.slice(1)} 
                      size="small" 
                      color="primary" 
                    />
                    <Typography variant="caption" color="text.secondary">
                      {format(idea.createdAt, 'MMM d, yyyy')}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    {idea.description}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <IconButton 
                    aria-label="discuss"
                    color="primary"
                    onClick={() => console.log('Discuss idea', idea.id)}
                  >
                    <ChatIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="edit"
                    color="primary"
                    onClick={() => handleEditOpen(idea)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteOpen(idea)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </GridItem>
          ))}
        </GridContainer>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Idea</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>Delete Idea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the idea &quot;{currentIdea?.title}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 