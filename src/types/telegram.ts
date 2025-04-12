/**
 * Интерфейс для данных пользователя Telegram
 */
export interface ITelegramUser {
  id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number | string;
  hash: string;
  signature?: string;
  language_code?: string;
  // Additional fields for our extended validation
  user_data?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    language_code?: string;
    [key: string]: unknown;
  };
}

/**
 * Интерфейс для объекта Telegram WebApp
 */
export interface TelegramWebApp {
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
    auth_date: number | string;
    hash: string;
  };
  ready(): void;
  expand(): void;
  close(): void;
  isExpanded?: boolean;
  platform?: string;
  viewportHeight?: number;
  viewportStableHeight?: number;
  MainButton?: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
}

/**
 * Расширенный тип данных пользователя Telegram для работы с WebApp
 */
export interface TelegramUserData {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
  auth_date: string | number;
  hash: string;
}

// Объявляем глобальный тип для window
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
    TelegramLoginWidget?: {
      dataOnauth: (user: ITelegramUser) => void;
    };
  }
} 