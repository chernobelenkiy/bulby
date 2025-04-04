// Idea type
export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  method: string;
  userId?: string; // Optional as ideas can be generated without auth
}

// Generated idea from AI
export interface GeneratedIdea {
  title: string;
  description: string;
  score: number; // Overall score after evaluation
  dreamerNotes?: string; // Optional notes from the Dreamer perspective
  realistNotes?: string; // Optional notes from the Realist perspective
  criticNotes?: string; // Optional notes from the Critic perspective
}

// Agent roles for Disney method
export enum AgentRole {
  DREAMER = 'dreamer',
  REALIST = 'realist',
  CRITIC = 'critic'
}

// Interface for message exchange in the chat
export interface ChatMessage {
  text: string;
  isUser: boolean;
  ideas?: GeneratedIdea[]; // For messages containing generated ideas
} 