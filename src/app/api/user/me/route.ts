import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/server/user';
import { validate, parse } from '@telegram-apps/init-data-node';
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
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader) {
      const authData = authHeader.split(' ')[1];
      console.log('Authenticating via Telegram Mini App initData');
      
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
        console.log('authData', authData);
        
        // Validate the initData using the official Telegram package
        validate(authData, botToken, {
          // Consider init data valid for 1 hour from creation
          expiresIn: 3600,
        });
        
        // Parse the initData to extract user information
        const parsedData = parse(authData);
        console.log('Telegram data validated successfully, user:', parsedData.user?.id);
        
        // Get or create user based on Telegram data
        const user = await getUserFromTelegramData(parsedData);
        
        if (user) {
          return NextResponse.json({ user });
        } else {
          return NextResponse.json({ 
            user: null, 
            error: 'Could not create user from Telegram data' 
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
    
    // Standard session authentication
    console.log('Authenticating via session');
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('Session authentication failed');
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    console.log('Session authentication successful');
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
      console.error('No user data found in Telegram initData');
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
      console.log('Creating new user for Telegram ID:', telegramId);
      
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
      
      console.log('New user created:', dbUser.id);
    } else {
      console.log('Existing user found:', dbUser.id);
    }
    
    return dbUser;
  } catch (error) {
    console.error('Error processing Telegram user data:', error);
    return null;
  }
} 