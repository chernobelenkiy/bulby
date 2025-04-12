import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, GeneratedIdea } from '@/types/ideas';
import i18n from '@/lib/i18n';
import { getTokenBalance, deductTokens, hasEnoughTokens, METHOD_COSTS } from '@/lib/tokenManager';

// Define Method interface
export interface Method {
  id: string;
  nameKey?: string;
  descriptionKey?: string;
  name: string;
  description: string;
}

// Methods data for idea generation
export const METHODS: Method[] = [
  { 
    id: 'brainstorming',
    nameKey: 'generator.methods.brainstorming.name',
    descriptionKey: 'generator.methods.brainstorming.description',
    // Fallback values
    name: 'Brainstorming', 
    description: 'Generate as many ideas as possible without judgment' 
  },
  { 
    id: 'scamper', 
    nameKey: 'generator.methods.scamper.name',
    descriptionKey: 'generator.methods.scamper.description',
    // Fallback values
    name: 'SCAMPER', 
    description: 'Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse' 
  },
  { 
    id: 'sixHats', 
    nameKey: 'generator.methods.sixHats.name',
    descriptionKey: 'generator.methods.sixHats.description',
    // Fallback values
    name: 'Six Thinking Hats', 
    description: 'Look at the problem from different perspectives' 
  },
  { 
    id: 'mindMapping', 
    nameKey: 'generator.methods.mindMapping.name',
    descriptionKey: 'generator.methods.mindMapping.description',
    // Fallback values
    name: 'Mind Mapping', 
    description: 'Visually organize information to find connections' 
  },
  { 
    id: 'disney', 
    nameKey: 'generator.methods.disney.name',
    descriptionKey: 'generator.methods.disney.description',
    // Fallback values
    name: 'Disney Method', 
    description: 'Analyze ideas from three perspectives: Dreamer, Realist, and Critic' 
  },
];

interface IdeaGeneratorState {
  // Available methods for idea generation
  methods: Method[];
  
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
  
  // Token management
  tokenBalance: number;
  refreshTokenBalance: () => void;
  
  // Generate ideas using the API
  generateIdeas: (prompt: string, method: string) => Promise<void>;
}

export const useIdeaGeneratorStore = create<IdeaGeneratorState>()(
  persist(
    (set, get) => ({
      // Available methods
      methods: METHODS,

      // Initial state
      selectedMethod: '',
      messages: [
        { 
          text: i18n.t('generator.welcome'),
          isUser: false 
        },
      ],
      isLoading: false,
      savedIdeas: [],
      
      // Initial token balance
      tokenBalance: 0, // Will be refreshed on component mount
      
      // Refresh token balance from storage
      refreshTokenBalance: () => {
        const balance = getTokenBalance();
        set({ tokenBalance: balance });
      },
      
      // Method selection
      setSelectedMethod: (method) => {
        set({ selectedMethod: method });
        
        // Get method details to display in chat
        const methodDetails = METHODS.find(m => m.id === method);
        if (methodDetails) {
          const { messages } = get();
          const methodName = methodDetails.nameKey ? i18n.t(methodDetails.nameKey) : methodDetails.name;
          const methodDescription = methodDetails.descriptionKey ? i18n.t(methodDetails.descriptionKey) : methodDetails.description;
          
          set({
            messages: [
              ...messages, 
              {
                text: i18n.t('generator.methodSelected', {
                  methodName,
                  methodDescription
                }),
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
        const { addMessage, setIsLoading, refreshTokenBalance } = get();
        
        // Check if user has enough tokens
        if (!hasEnoughTokens(method)) {
          addMessage({
            text: i18n.t('generator.notEnoughTokens', { 
              cost: METHOD_COSTS[method as keyof typeof METHOD_COSTS] || 10 
            }),
            isUser: false
          });
          return;
        }
        
        // Add user message
        addMessage({ text: prompt, isUser: true });
        
        // Set loading state
        setIsLoading(true);
        
        try {
          // Get the current language
          const currentLanguage = i18n.language;
          
          // Call the API to generate ideas
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              method,
              language: currentLanguage // Add the language parameter
            }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            // Deduct tokens on successful generation
            deductTokens(method);
            refreshTokenBalance();
            
            // Add AI response with generated ideas
            addMessage({
              text: i18n.t('generator.ideasGenerated', { prompt }),
              isUser: false,
              ideas: data.ideas
            });
          } else {
            // Handle error response
            addMessage({
              text: i18n.t('generator.error', { error: data.error || 'Unknown error' }),
              isUser: false
            });
          }
        } catch (error) {
          console.error('Error generating ideas:', error);
          addMessage({
            text: i18n.t('generator.generalError'),
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