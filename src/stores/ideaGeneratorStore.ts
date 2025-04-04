import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, GeneratedIdea } from '@/types/ideas';

interface IdeaGeneratorState {
  // Selected method for idea generation
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  
  // Chat messages
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  
  // Saved ideas
  savedIdeas: GeneratedIdea[];
  saveIdea: (idea: GeneratedIdea, method: string) => void;
  removeIdea: (ideaTitle: string) => void;
  
  // Generate ideas using the API
  generateIdeas: (prompt: string, method: string) => Promise<void>;
}

export const useIdeaGeneratorStore = create<IdeaGeneratorState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedMethod: '',
      messages: [
        { 
          text: "Hi there! I'm your AI assistant. I can help you generate ideas using different methods. Select a method to get started.", 
          isUser: false 
        },
      ],
      isLoading: false,
      savedIdeas: [],
      
      // Method selection
      setSelectedMethod: (method) => {
        set({ selectedMethod: method });
        
        // Get method details to display in chat
        const methodDetails = METHODS.find(m => m.id === method);
        if (methodDetails) {
          const { messages } = get();
          set({
            messages: [
              ...messages, 
              {
                text: `You've selected the ${methodDetails.name} method. ${methodDetails.description}. What topic would you like to generate ideas for?`,
                isUser: false
              }
            ]
          });
        }
      },
      
      // Message management
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      
      setMessages: (messages) => set({ messages }),
      
      // Loading state
      setIsLoading: (isLoading) => set({ isLoading }),
      
      // Saved ideas management
      saveIdea: (idea, method) => {
        const { savedIdeas } = get();
        const isAlreadySaved = savedIdeas.some(
          savedIdea => savedIdea.title === idea.title
        );
        
        if (isAlreadySaved) {
          // Remove from saved ideas
          set({
            savedIdeas: savedIdeas.filter(
              savedIdea => savedIdea.title !== idea.title
            )
          });
        } else {
          // Add to saved ideas with method and date info
          const ideaWithMetadata = {
            ...idea,
            method,
            createdAt: new Date().toISOString()
          };
          set({ savedIdeas: [...savedIdeas, ideaWithMetadata] });
        }
      },
      
      removeIdea: (ideaTitle) => {
        const { savedIdeas } = get();
        set({
          savedIdeas: savedIdeas.filter(idea => idea.title !== ideaTitle)
        });
      },
      
      // Generate ideas API call
      generateIdeas: async (prompt, method) => {
        const { addMessage, setIsLoading } = get();
        
        // Add user message
        addMessage({ text: prompt, isUser: true });
        
        // Set loading state
        setIsLoading(true);
        
        try {
          // Call the API to generate ideas
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              method,
            }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Add AI response with generated ideas
            addMessage({
              text: `Here are some ideas based on your prompt: "${prompt}"`,
              isUser: false,
              ideas: data.ideas
            });
          } else {
            // Handle error response
            addMessage({
              text: `Sorry, I encountered an error: ${data.error || 'Unknown error'}`,
              isUser: false
            });
          }
        } catch (error) {
          console.error('Error generating ideas:', error);
          addMessage({
            text: 'Sorry, there was an error processing your request. Please try again.',
            isUser: false
          });
        } finally {
          setIsLoading(false);
        }
      },
    }),
    {
      name: 'idea-generator-storage',
      partialize: (state) => ({ savedIdeas: state.savedIdeas }),
    }
  )
);

// Mock data for idea generation methods
const METHODS = [
  { id: 'brainstorming', name: 'Brainstorming', description: 'Generate as many ideas as possible without judgment' },
  { id: 'scamper', name: 'SCAMPER', description: 'Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse' },
  { id: 'sixHats', name: 'Six Thinking Hats', description: 'Look at the problem from different perspectives' },
  { id: 'mindMapping', name: 'Mind Mapping', description: 'Visually organize information to find connections' },
  { id: 'disney', name: 'Disney Method', description: 'Analyze ideas from three perspectives: Dreamer, Realist, and Critic' },
]; 