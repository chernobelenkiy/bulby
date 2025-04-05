import { create } from 'zustand';
import { User, UserState } from '@/types/user';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  /**
   * Set the user state
   */
  setUser: (user: User | null) => set({ 
    user,
    isAuthenticated: !!user
  }),
  
  /**
   * Set the loading state
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  /**
   * Set the error state
   */
  setError: (error: string | null) => set({ error }),
  
  /**
   * Clear the user state (logout)
   */
  clearUser: () => set({ 
    user: null, 
    isAuthenticated: false,
    error: null 
  }),
  
  /**
   * Fetch the current user from the API
   */
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/user/me');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const data = await response.json();
      
      if (data.user) {
        set({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ 
        error: 'Failed to fetch user', 
        isLoading: false,
        isAuthenticated: false
      });
    }
  }
})); 