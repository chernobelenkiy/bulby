import { prisma } from './prisma';
import { ITelegramUser } from "@/types/telegram";

export class AuthService {
  /**
   * Creates or updates a user from Telegram login data
   */
  static async createOrUpdateTelegramUser(telegramData: ITelegramUser) {
    try {
      const telegramId = telegramData.id.toString();
      
      // Try to find an existing user by telegramId
      let user = await prisma.user.findUnique({
        where: { telegramId }
      });
      
      if (user) {
        // Update existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
            image: telegramData.photo_url,
            telegramData: JSON.stringify(telegramData)
          }
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            telegramId,
            name: `${telegramData.first_name} ${telegramData.last_name || ''}`.trim(),
            image: telegramData.photo_url,
            telegramData: JSON.stringify(telegramData)
          }
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error creating/updating Telegram user:', error);
      throw error;
    }
  }
  
  /**
   * Initializes user data if needed
   */
  static async initializeUserData(userId: string) {
    // Initialize any default settings or preferences for new users here
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        console.error(`User with id ${userId} not found during initialization`);
        return;
      }
      
      // Initialize other user-related data if needed
      // For example, creating default settings, preferences, etc.
      
      console.log(`User ${userId} data initialized successfully`);
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  }
} 