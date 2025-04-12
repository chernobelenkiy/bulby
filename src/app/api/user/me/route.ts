import { NextResponse } from 'next/server';
import { getCurrentUser, getCurrentUserFromTelegram } from '@/app/server/user';

/**
 * GET /api/user/me
 * Returns the current authenticated user
 * Supports both standard web session and Telegram WebApp authentication
 */
export async function GET(request: Request) {
  try {
    // Проверяем наличие данных Telegram WebApp
    const telegramInitData = request.headers.get('X-Telegram-Init-Data');
    console.log('Telegram initData:', telegramInitData);
    
    if (telegramInitData) {
      console.log('Authenticating via Telegram WebApp initData:', telegramInitData.substring(0, 50) + '...');
      
      // Пытаемся получить или создать пользователя по данным Telegram
      try {
        const user = await getCurrentUserFromTelegram(telegramInitData);
        
        if (user) {
          console.log('Telegram WebApp authentication successful, user:', user.id);
          return NextResponse.json({ user });
        } else {
          console.log('Telegram WebApp authentication failed - invalid data');
          // Возвращаем 401, но позволяем клиенту увидеть точную причину
          return NextResponse.json({ 
            user: null, 
            error: 'Invalid Telegram WebApp data' 
          }, { status: 401 });
        }
      } catch (error) {
        console.error('Error processing Telegram auth:', error);
        return NextResponse.json({ 
          user: null, 
          error: 'Telegram auth processing error' 
        }, { status: 401 });
      }
    }
    
    // Стандартная аутентификация через сессию
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