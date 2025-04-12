import { create } from 'zustand';
import { User, UserState } from '@/types/user';

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  /**
   * Set the user state
   */
  setUser: (user: User | null) => {
    console.log('📂 UserStore: Setting user state:', user?.id || 'null');
    set({ 
      user,
      isAuthenticated: !!user
    });
  },
  
  /**
   * Set the loading state
   */
  setLoading: (isLoading: boolean) => {
    console.log('📂 UserStore: Setting loading state:', isLoading);
    set({ isLoading });
  },
  
  /**
   * Set the error state
   */
  setError: (error: string | null) => {
    console.log('📂 UserStore: Setting error state:', error);
    set({ error });
  },
  
  /**
   * Clear the user state (logout)
   */
  clearUser: () => {
    console.log('📂 UserStore: Clearing user state');
    set({ 
      user: null, 
      isAuthenticated: false,
      error: null 
    });
  },
  
  /**
   * Fetch the current user from the API
   */
  fetchUser: async () => {
    // Don't fetch if already loading
    if (get().isLoading) {
      console.log('📂 UserStore: Already loading, skipping fetch');
      return;
    }
    
    console.log('📂 UserStore: Fetching user from API');
    set({ isLoading: true, error: null });
    
    try {
      console.log('📂 UserStore: Making API request to /api/user/me');
      const response = await fetch('/api/user/me');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`📂 UserStore: API error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch user: ${response.status} ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📂 UserStore: API response:', data);
      
      if (data.user) {
        console.log('📂 UserStore: User found in response, setting authenticated state');
        set({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        console.log('📂 UserStore: No user in response, setting unauthenticated state');
        set({ 
          user: null,
          isAuthenticated: false,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('📂 UserStore: Error fetching user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user', 
        isLoading: false,
        isAuthenticated: false
      });
    }
  }
})); 