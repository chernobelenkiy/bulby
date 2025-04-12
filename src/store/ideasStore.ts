"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Idea, GeneratedIdea } from '@/types/ideas';

interface IdeasState {
  // State
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD actions
  fetchIdeas: () => Promise<void>;
  saveIdea: (idea: GeneratedIdea, method: string) => Promise<void>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  
  // Local state management
  setIdeas: (ideas: Idea[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Define a response type for API fetching
interface IdeaResponse extends Omit<Idea, 'createdAt'> {
  createdAt: string;
}

export const useIdeasStore = create<IdeasState>()(
  persist(
    (set, get) => ({
      // Initial state
      ideas: [],
      isLoading: false,
      error: null,
      
      // Set local state
      setIdeas: (ideas) => set({ ideas }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Fetch all ideas from the server
      fetchIdeas: async () => {
        const { setLoading, setError, setIdeas } = get();
        
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('/api/ideas');
          
          if (!response.ok) {
            throw new Error('Failed to fetch ideas');
          }
          
          const data = await response.json();
          
          // Transform dates from strings to Date objects
          const ideas = data.ideas.map((idea: IdeaResponse) => ({
            ...idea,
            createdAt: new Date(idea.createdAt)
          }));
          
          setIdeas(ideas);
        } catch (error) {
          console.error('Error fetching ideas:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch ideas');
        } finally {
          setLoading(false);
        }
      },
      
      // Save a new idea to the server
      saveIdea: async (idea, method) => {
        const { setLoading, setError, fetchIdeas } = get();
        
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('/api/ideas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: idea.title,
              description: idea.description,
              method,
              dreamerNotes: idea.dreamerNotes,
              realistNotes: idea.realistNotes,
              criticNotes: idea.criticNotes,
              score: idea.score
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to save idea');
          }
          
          // Refresh ideas list after saving
          await fetchIdeas();
        } catch (error) {
          console.error('Error saving idea:', error);
          setError(error instanceof Error ? error.message : 'Failed to save idea');
        } finally {
          setLoading(false);
        }
      },
      
      // Update an existing idea
      updateIdea: async (id, updates) => {
        const { setLoading, setError, fetchIdeas } = get();
        
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`/api/ideas/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          });
          
          if (!response.ok) {
            throw new Error('Failed to update idea');
          }
          
          // Refresh ideas list after updating
          await fetchIdeas();
        } catch (error) {
          console.error('Error updating idea:', error);
          setError(error instanceof Error ? error.message : 'Failed to update idea');
        } finally {
          setLoading(false);
        }
      },
      
      // Delete an idea
      deleteIdea: async (id) => {
        const { setLoading, setError, fetchIdeas } = get();
        
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`/api/ideas/${id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete idea');
          }
          
          // Refresh ideas list after deletion
          await fetchIdeas();
        } catch (error) {
          console.error('Error deleting idea:', error);
          setError(error instanceof Error ? error.message : 'Failed to delete idea');
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'ideas-storage',
      partialize: (state) => ({ ideas: state.ideas }),
    }
  )
); 