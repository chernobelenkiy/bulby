import { createHash, createHmac } from 'crypto';
import { browserStorage } from "@/lib/browser-storage";
import { logger } from "@/lib/logger";
import { TelegramUserData, ITelegramUser } from '@/types/telegram';


/**
 * Парсим строку параметров URL для получения данных Telegram WebApp
 */
export function parseUrlForTelegramData(): TelegramUserData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const url = new URL(window.location.href);
    const tgWebAppData = url.searchParams.get('tgWebAppData');
    const tgWebAppUser = url.searchParams.get('tgWebAppUser');
    
    console.log("🔗 URL params:", { 
      tgWebAppData, 
      tgWebAppUser,
      all: Object.fromEntries(url.searchParams)
    });
    
    if (tgWebAppUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(tgWebAppUser));
        console.log("👤 Parsed user data from URL:", userData);
        return {
          id: userData.id.toString(),
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          language_code: userData.language_code,
          auth_date: Math.floor(Date.now() / 1000).toString(),
          hash: "placeholder_hash_from_url"
        };
      } catch (e) {
        console.error("❌ Error parsing tgWebAppUser:", e);
      }
    }
    
    return null;
  } catch (error) {
    console.error("❌ Error parsing URL for Telegram data:", error);
    return null;
  }
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
 * Извлечь информацию о пользователе из Telegram WebApp
 * @returns TelegramUserData | null
 */
export function extractTelegramUserData(): TelegramUserData | null {
  try {
    if (window.Telegram?.WebApp) {
      logger.info("Extracting user data from Telegram WebApp");
      const userData = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (userData) {
        logger.info("User data successfully extracted from WebApp:", userData);
        return {
          id: userData.id.toString(),
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          language_code: userData.language_code,
          photo_url: userData.photo_url,
          auth_date: String(window.Telegram?.WebApp?.initDataUnsafe?.auth_date || Date.now()),
          hash: window.Telegram?.WebApp?.initDataUnsafe?.hash || "test_hash",
        };
      } else {
        logger.warn("No user data found in WebApp");
      }
    }

    // Если не удалось получить данные из WebApp, пробуем из URL
    logger.info("Trying to extract user data from URL parameters");
    return parseUrlForTelegramData();
  } catch (e) {
    logger.error("Error extracting Telegram user data:", e);
    return null;
  }
}

/**
 * Аутентификация пользователя через Telegram WebApp
 * @returns Promise<boolean>
 */
export async function authenticateWithTelegramWebApp(): Promise<boolean> {
  try {
    logger.info("Starting Telegram WebApp authentication process");
    
    // Попытка извлечь данные пользователя
    const userData = extractTelegramUserData();
    
    if (!userData) {
      logger.warn("Failed to extract user data and no test data available");
      return false;
    }
    
    // Сохраняем данные пользователя
    browserStorage.setItem("telegramUser", JSON.stringify(userData));
    logger.info("User authenticated successfully:", userData);
    
    return true;
  } catch (e) {
    logger.error("Error during Telegram WebApp authentication:", e);
    return false;
  }
}

// Authentication validator
export type AuthDataMap = Map<string, string | number | undefined>;

export class AuthDataValidator {
  private botToken: string;
  private inValidateDataAfter: number;

  constructor({ botToken }: { botToken: string }) {
    this.botToken = botToken;
    this.inValidateDataAfter = 86400; // 24 hours by default
  }

  /**
   * Validates the data sent by Telegram Login Widget
   */
  async validate<T extends { id: number | string } = ITelegramUser>(
    authDataMap: AuthDataMap
  ): Promise<T> {
    try {
      // Check required fields
      const hash = authDataMap.get('hash') as string;
      const authDate = authDataMap.get('auth_date') as number;
      const id = authDataMap.get('id');

      if (!hash || !authDate || !id) {
        throw new Error('Invalid! Incomplete data provided.');
      }

      // Check if data is expired
      const now = Math.floor(Date.now() / 1000);
      if (now - Number(authDate) > this.inValidateDataAfter) {
        throw new Error('Authentication data is expired');
      }

      // Create a copy without the hash
      const dataCheckMap = new Map(authDataMap);
      dataCheckMap.delete('hash');

      // Get data string
      const dataCheckString = this.getDataCheckString(dataCheckMap);

      // Create secret key
      const secretKey = createHash('sha256')
        .update(this.botToken)
        .digest();

      // Calculate hash
      const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      // Verify hash
      if (calculatedHash !== hash) {
        throw new Error('Data integrity check failed');
      }

      // Return data as object
      return Object.fromEntries(authDataMap.entries()) as T;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  /**
   * Creates a string for data verification
   */
  private getDataCheckString(authDataMap: AuthDataMap): string {
    const dataToCheck: string[] = [];

    for (const [key, value] of authDataMap.entries()) {
      if (value !== undefined) {
        dataToCheck.push(`${key}=${value}`);
      }
    }
    
    // Sort alphabetically as required by Telegram
    dataToCheck.sort();

    return dataToCheck.join('\n');
  }
} 