import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/server/user';
import { validate3rd, parse } from '@telegram-apps/init-data-node';
import { User } from '@/types/user';

// Define interface for parsed Telegram user data
interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  [key: string]: unknown;
}

// Define interface for parsed Telegram data
interface ParsedTelegramData {
  user?: TelegramUserData;
  auth_date?: Date;
  [key: string]: unknown;
}

/**
 * GET /api/user/me
 * Returns the current authenticated user
 * Supports both standard web session and Telegram Mini App authentication
 */
export async function GET(request: Request) {
  try {
    // Extract auth header - expected format: "tma <initData>"
    const authHeader = request.headers.get('Authorization');
    let telegramInitData = null;
    
    // Process the auth header if available
    if (authHeader?.startsWith('tma ')) {
      telegramInitData = authHeader.substring(4);
    }
    
    // Proceed with Telegram authentication if initData is available
    if (telegramInitData) {
      try {
        // Get bot token from environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
          return NextResponse.json({ 
            user: null, 
            error: 'Server configuration error' 
          }, { status: 500 });
        }
        
        // Extract bot ID from the token (number before the colon)
        const botId = parseInt(botToken.split(':')[0]);
        
        // Validate the initData using Ed25519 (modern Telegram method)
        await validate3rd(telegramInitData, botId, { expiresIn: 3600 });
        
        // Parse the initData to extract user information
        const parsedData = parse(telegramInitData);
        
        // Get or create user based on Telegram data
        if (parsedData.user) {
          const user = await getUserFromTelegramData(parsedData);
          
          if (user) {
            return NextResponse.json({ user });
          } else {
            return NextResponse.json({ 
              user: null, 
              error: 'Could not create user from Telegram data' 
            }, { status: 401 });
          }
        } else {
          return NextResponse.json({ 
            user: null, 
            error: 'No user data found in Telegram initData' 
          }, { status: 401 });
        }
      } catch (error) {
        console.error('Error processing Telegram auth:', error);
        return NextResponse.json({ 
          user: null, 
          error: error instanceof Error ? error.message : 'Telegram auth processing error' 
        }, { status: 401 });
      }
    }
    
    // Standard session authentication if no Telegram data
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get or create a user from parsed Telegram data
 */
async function getUserFromTelegramData(parsedData: ParsedTelegramData): Promise<User | null> {
  try {
    const { user } = parsedData;
    
    if (!user || !user.id) {
      return null;
    }
    
    // Convert Telegram ID to string
    const telegramId = String(user.id);
    
    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('@/lib/prisma');
    
    // Check if user exists in database
    let dbUser = await prisma.user.findFirst({
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
    if (!dbUser) {
      const name = user.first_name + (user.last_name ? ` ${user.last_name}` : '');
      
      dbUser = await prisma.user.create({
        data: {
          id: `telegram-${telegramId}`,
          name,
          telegramId,
          telegramData: JSON.stringify(user),
          image: user.photo_url || null,
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
    }
    
    return dbUser;
  } catch (error) {
    console.error('Error processing Telegram user data:', error);
    return null;
  }
} 