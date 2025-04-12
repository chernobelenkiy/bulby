'use client';

import { useState, useEffect } from 'react';
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
  Chip,
  CircularProgress,
  Collapse
} from '@mui/material';
import { GridContainer, GridItem } from '@/components/CustomGrid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { useIdeasStore } from '@/store/ideasStore';
import { useTheme } from '@mui/material/styles';

export default function IdeasClient() {
  const { t } = useTranslation();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentIdeaId, setCurrentIdeaId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [expandedIdeas, setExpandedIdeas] = useState<Record<string, boolean>>({});
  
  // Get data and actions from the ideas store
  const { 
    ideas, 
    isLoading, 
    error, 
    fetchIdeas, 
    updateIdea, 
    deleteIdea 
  } = useIdeasStore();
  
  // Fetch ideas on component mount
  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);
  
  // Get the current idea based on the selected ID
  const currentIdea = currentIdeaId ? ideas.find(idea => idea.id === currentIdeaId) : null;
  
  const handleEditOpen = (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      setCurrentIdeaId(ideaId);
      setEditedTitle(idea.title);
      setEditedDescription(idea.description);
      setOpenEdit(true);
    }
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentIdeaId(null);
  };

  const handleEditSave = async () => {
    if (!currentIdeaId) return;
    
    await updateIdea(currentIdeaId, {
      title: editedTitle,
      description: editedDescription
    });
    
    setOpenEdit(false);
    setCurrentIdeaId(null);
  };

  const handleDeleteOpen = (ideaId: string) => {
    setCurrentIdeaId(ideaId);
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setCurrentIdeaId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!currentIdeaId) return;
    
    await deleteIdea(currentIdeaId);
    setOpenDelete(false);
    setCurrentIdeaId(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Toggle expanded state for an idea
  const toggleExpand = (ideaId: string) => {
    setExpandedIdeas(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }));
  };

  const theme = useTheme();

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
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => fetchIdeas()}
          >
            {t('ideas.retry')}
          </Button>
        </Paper>
      ) : ideas.length === 0 ? (
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
                      {formatDate(idea.createdAt.toString())}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" color="text.secondary">
                    {idea.description}
                  </Typography>
                  
                  {/* Notes section */}
                  {(idea.dreamerNotes || idea.realistNotes || idea.criticNotes) && (
                    <>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Button
                          size="small"
                          color="primary"
                          endIcon={<ExpandMoreIcon 
                            sx={{ 
                              transform: expandedIdeas[idea.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s',
                              fontSize: '1rem'
                            }} 
                          />}
                          onClick={() => toggleExpand(idea.id)}
                          sx={{ py: 0, px: 1, minWidth: 'auto' }}
                        >
                          {expandedIdeas[idea.id] ? t('generator.hideDetails') : t('generator.showDetails')}
                        </Button>
                      </Box>
                      
                      <Collapse in={expandedIdeas[idea.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1 }}>
                          {idea.dreamerNotes && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="primary" fontWeight="bold">
                                {t('generator.dreamerNotes')}
                              </Typography>
                              <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.primary.main}`, mb: 1 }}>
                                {idea.dreamerNotes}
                              </Typography>
                            </Box>
                          )}
                          
                          {idea.realistNotes && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="info.main" fontWeight="bold">
                                {t('generator.realistNotes')}
                              </Typography>
                              <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.info.main}`, mb: 1 }}>
                                {idea.realistNotes}
                              </Typography>
                            </Box>
                          )}
                          
                          {idea.criticNotes && (
                            <Box sx={{ mb: 0.5 }}>
                              <Typography variant="caption" color="error.main" fontWeight="bold">
                                {t('generator.criticNotes')}
                              </Typography>
                              <Typography variant="body2" sx={{ pl: 1, borderLeft: `2px solid ${theme.palette.error.main}`, mb: 0.5 }}>
                                {idea.criticNotes}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </>
                  )}
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
                    onClick={() => handleEditOpen(idea.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDeleteOpen(idea.id)}
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
        <DialogTitle>{t('ideas.editIdea')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label={t('ideas.title')}
              fullWidth
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <TextField
              label={t('ideas.description')}
              fullWidth
              multiline
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>{t('ideas.cancel')}</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">{t('ideas.save')}</Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>{t('ideas.deleteIdea')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('ideas.deleteConfirmation', { title: currentIdea?.title })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>{t('ideas.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">{t('ideas.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 