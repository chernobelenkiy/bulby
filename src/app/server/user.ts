'use server';

import { prisma } from '@/lib/prisma';
import { User } from '@/types/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { AuthDataValidator } from '@/lib/telegram';

/**
 * Get the current authenticated user from the database
 * 
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return null;
    }
    
    const userId = session.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        image: true,
        telegramData: true,
      }
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Validates Telegram WebApp init data and returns the corresponding user
 * 
 * @param initData The initData string from Telegram WebApp
 * @returns User object or null if authentication fails
 */
export async function getCurrentUserFromTelegram(initData: string): Promise<User | null> {
  try {
    console.log('Processing Telegram initData, length:', initData.length);
    if (!initData) {
      console.error('Empty initData provided');
      return null;
    }
    
    // Get bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
      return null;
    }
    
    // Лимит на длину данных - слишком короткая строка не может быть валидной
    if (initData.length < 50) {
      console.error('Telegram initData is too short:', initData);
      return null;
    }
    
    // Parse initData string (format: key1=value1&key2=value2)
    const authDataMap = new Map<string, string | number | undefined>();
    const params = new URLSearchParams(initData);
    
    // Логируем полученные параметры
    console.log('Parsed URL params:', Object.fromEntries(params.entries()));
    
    // Проверка наличия hash-а - ключевой параметр для валидации
    if (!params.has('hash')) {
      console.error('No hash parameter in Telegram initData');
      return null;
    }
    
    for (const [key, value] of params.entries()) {
      // Convert auth_date to number
      if (key === 'auth_date') {
        authDataMap.set(key, parseInt(value, 10));
      } 
      // Parse user object
      else if (key === 'user') {
        try {
          const userData = JSON.parse(value);
          console.log('Parsed user data:', userData);
          
          // Extract user fields to the top level for the validator
          authDataMap.set('id', userData.id);
          authDataMap.set('first_name', userData.first_name);
          if (userData.last_name) authDataMap.set('last_name', userData.last_name);
          if (userData.username) authDataMap.set('username', userData.username);
          if (userData.photo_url) authDataMap.set('photo_url', userData.photo_url);
        } catch (e) {
          console.error('Failed to parse user data:', e, 'Raw value:', value);
        }
      } 
      // Handle other fields normally
      else {
        authDataMap.set(key, value);
      }
    }
    
    // Проверяем, что у нас есть необходимые поля для аутентификации
    if (!authDataMap.has('id') || !authDataMap.has('first_name')) {
      console.error('Missing required user fields in Telegram data');
      
      // Если мы в режиме разработки, создаем тестового пользователя
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_TEST_USER === 'true') {
        console.log('DEV MODE: Creating test Telegram user');
        const testUser = {
          id: 'test-telegram-user',
          name: 'Test User',
          telegramId: '12345678',
          telegramData: JSON.stringify({
            id: 12345678,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          }),
          image: null
        };
        return testUser;
      }
      
      return null;
    }
    
    // Validate the data
    try {
      const validator = new AuthDataValidator({ botToken });
      const telegramUser = await validator.validate(authDataMap);
      
      if (!telegramUser || !telegramUser.id) {
        console.error('Telegram data validation failed');
        return null;
      }
      
      console.log('Telegram validation successful for user ID:', telegramUser.id);
      
      // Convert Telegram ID to string
      const telegramId = String(telegramUser.id);
      
      // Check if user exists in database
      let user = await prisma.user.findFirst({
        where: { telegramId },
        select: {
          id: true,
          name: true,
          email: true,
          telegramId: true,
          image: true,
          telegramData: true,
        }
      });
      
      // If user doesn't exist, create a new one
      if (!user) {
        console.log('Creating new user for Telegram ID:', telegramId);
        
        const name = [telegramUser.first_name, telegramUser.last_name]
          .filter(Boolean)
          .join(' ');
          
        user = await prisma.user.create({
          data: {
            id: `telegram-${telegramId}`,
            name,
            telegramId,
            telegramData: JSON.stringify(telegramUser),
            image: telegramUser.photo_url || null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            telegramId: true,
            image: true,
            telegramData: true,
          }
        });
        
        console.log('New user created:', user.id);
      } else {
        console.log('Existing user found:', user.id);
      }
      
      return user;
    } catch (error) {
      console.error('Error validating Telegram data:', error);
      return null;
    }
  } catch (error) {
    console.error('Error processing Telegram user:', error);
    return null;
  }
}

/**
 * Get a user by ID from the database
 * 
 * @param userId User ID to fetch
 * @returns User object or null if not found
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        telegramId: true,
        image: true,
        telegramData: true,
      }
    });
    
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
} 