import { NextRequest, NextResponse } from 'next/server';
import { generateIdeasUsingDisneyMethod } from '@/lib/disneyMethod';

export async function POST(request: NextRequest) {
  try {
    const { prompt, method = 'disney', language = 'en' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For methods other than Disney, we'll implement different logic later
    if (method !== 'disney') {
      return NextResponse.json(
        { error: 'Only Disney method is currently supported' },
        { status: 400 }
      );
    }

    // Use the extracted Disney method function with language parameter
    const finalIdeas = await generateIdeasUsingDisneyMethod(prompt, language);

    // Return ideas with method info
    return NextResponse.json({
      ideas: finalIdeas,
      method: 'disney',
      language: language
    });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
} 