import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/server/user';

/**
 * GET /api/user/me
 * Returns the current authenticated user
 */
export async function GET() {
  try {
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