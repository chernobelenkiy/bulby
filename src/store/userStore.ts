import { create } from 'zustand';
import { User, UserState } from '@/types/user';

// Максимальное количество попыток авторизации
const MAX_AUTH_RETRIES = 3;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  authRetries: 0,
  
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
    // Проверяем слишком частые повторы
    const { authRetries } = get();
    if (authRetries >= MAX_AUTH_RETRIES) {
      set({ 
        error: 'Telegram WebApp authentication failed after multiple attempts', 
        isLoading: false 
      });
      return;
    }
    
    // Don't fetch if already loading
    if (get().isLoading) {
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      
      const webApp = window.Telegram?.WebApp;
      let headers = {};
      
      if (webApp?.initData) {
        headers = {
          'X-Telegram-Init-Data': webApp.initData
        };
      }

      const response = await fetch('/api/user/me', { headers });
      
      const data = await response.json();
      console.log('📂 UserStore: API response:', data);
      
      if (data.user) {
        console.log('📂 UserStore: User found in response, setting authenticated state');
        set({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          authRetries: 0 // Сбрасываем счетчик попыток при успехе
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