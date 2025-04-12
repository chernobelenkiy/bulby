export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  telegramId?: string | null;
  image?: string | null;
  telegramData?: string | null;
}

// Тип для данных пользователя из Telegram WebApp
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Methods
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
  fetchUser: (initDataRaw?: string) => Promise<void>;
} 