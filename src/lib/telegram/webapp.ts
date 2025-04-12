import { TelegramWebApp, TelegramUserData } from '@/types/telegram';
import { browserStorage } from "@/lib/browser-storage";
import { logger } from "@/lib/logger";

/**
 * Check if the application is running inside Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  const isWebApp = typeof window !== 'undefined' && (
    !!window.Telegram?.WebApp || // основной способ
    window.location.search.includes('tgWebAppData=') // резервный способ
  );
  console.log('📱 isTelegramWebApp check:', isWebApp);
  return isWebApp;
}

/**
 * Get the Telegram WebApp object
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (isTelegramWebApp()) {
    console.log('📱 getTelegramWebApp: WebApp found');
    return window.Telegram?.WebApp || null;
  }
  console.log('📱 getTelegramWebApp: WebApp not found');
  return null;
}

/**
 * Initialize Telegram WebApp by calling the ready method
 * This should be called when the app is loaded to tell Telegram that the WebApp is ready
 */
export function initializeTelegramWebApp(): void {
  const webApp = getTelegramWebApp();
  if (webApp) {
    try {
      console.log('📱 Initializing Telegram WebApp with ready()');
      webApp.ready();
      console.log('📱 WebApp ready() called');
      
      // Dump all WebApp data for debugging
      console.log('📱 WebApp data dump:', {
        initData: webApp.initData,
        platform: webApp.platform,
        isExpanded: webApp.isExpanded,
        viewportHeight: webApp.viewportHeight,
        user: webApp.initDataUnsafe?.user ? {
          id: webApp.initDataUnsafe.user.id,
          first_name: webApp.initDataUnsafe.user.first_name,
          last_name: webApp.initDataUnsafe.user.last_name,
          username: webApp.initDataUnsafe.user.username
        } : 'No user data',
        authDate: webApp.initDataUnsafe?.auth_date || 'No auth date'
      });
    } catch (error) {
      console.error('📱 Error initializing Telegram WebApp:', error);
    }
  } else {
    console.log('📱 Not running in Telegram WebApp, skipping initialization');
  }
}

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
 * @returns ITelegramUser | null
 */
export function extractTelegramUserData(): TelegramUserData | null {
  try {
    if (isInTelegramWebApp()) {
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
 * Проверяем, находимся ли мы внутри Telegram WebApp
 */
export function isInTelegramWebApp(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.Telegram && window.Telegram.WebApp);
}

/**
 * Аутентификация пользователя через Telegram WebApp
 * @returns Promise<boolean>
 */
export async function authenticateWithTelegramWebApp(): Promise<boolean> {
  try {
    logger.info("Starting Telegram WebApp authentication process");
    
    // Попытка извлечь данные пользователя
    let userData = extractTelegramUserData();
    
    // Если данные пользователя не найдены, но мы находимся в режиме разработки, используем тестовые данные
    if (!userData && process.env.NODE_ENV === "development") {
      logger.info("Using test user data for development");
      userData = {
        id: "12345678",
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        language_code: "en",
        photo_url: "https://t.me/i/userpic/320/1pXL2rPNGlSvDeBi1e1ZwmC-ZWMpRIQJ4Sxjle_Bfb4vq4IJ_C6M.jpg",
        auth_date: Date.now().toString(),
        hash: "test_hash",
      };
    }
    
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