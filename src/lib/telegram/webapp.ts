import { signIn } from 'next-auth/react';

/**
 * Type definition for the Telegram WebApp object available in window when
 * the app is running inside the Telegram client
 */
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
  };
  ready(): void;
  expand(): void;
  close(): void;
}

// Extend the Window interface to include Telegram.WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

/**
 * Check if the application is running inside Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

/**
 * Get the Telegram WebApp object
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (isTelegramWebApp()) {
    return window.Telegram?.WebApp || null;
  }
  return null;
}

/**
 * Convert initData string to a Map of key-value pairs
 */
export function parseInitData(initData: string): Map<string, string | number | undefined> {
  const data = new Map<string, string | number | undefined>();
  
  // Split by &
  const pairs = initData.split('&');
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      // Decode URI component and add to map
      data.set(key, decodeURIComponent(value));
    }
  }
  
  return data;
}

/**
 * Convert Telegram WebApp user data to the format needed for authentication
 */
export function convertWebAppUserToAuthData(webApp: TelegramWebApp): Map<string, string | number | undefined> {
  const authData = new Map<string, string | number | undefined>();
  
  // Extract data from initDataUnsafe
  if (webApp.initDataUnsafe.user) {
    authData.set('id', webApp.initDataUnsafe.user.id);
    authData.set('first_name', webApp.initDataUnsafe.user.first_name);
    authData.set('last_name', webApp.initDataUnsafe.user.last_name);
    authData.set('username', webApp.initDataUnsafe.user.username);
    authData.set('photo_url', webApp.initDataUnsafe.user.photo_url);
  }
  
  authData.set('auth_date', webApp.initDataUnsafe.auth_date);
  authData.set('hash', webApp.initDataUnsafe.hash);
  
  return authData;
}

/**
 * Authenticate user via Telegram WebApp
 * Automatically signs in the user when running inside Telegram WebApp
 */
export async function authenticateWithTelegramWebApp(): Promise<boolean> {
  try {
    const webApp = getTelegramWebApp();
    if (!webApp || !webApp.initDataUnsafe.user) {
      console.error('Not in Telegram WebApp or user data not available');
      return false;
    }
    
    const user = webApp.initDataUnsafe.user;
    
    // Format user data for authentication
    const authData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      photo_url: user.photo_url || '',
      auth_date: webApp.initDataUnsafe.auth_date,
      hash: webApp.initDataUnsafe.hash
    };
    
    // Sign in using NextAuth
    const result = await signIn('telegram-login', { 
      redirect: false,
      ...authData
    });
    
    return !!result?.ok;
  } catch (error) {
    console.error('Error authenticating with Telegram WebApp:', error);
    return false;
  }
} 