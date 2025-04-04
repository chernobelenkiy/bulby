import { NextRequest, NextResponse } from 'next/server';
import { generateIdeasUsingDisneyMethod } from '@/lib/disneyMethod';
import { generateIdeasUsingBrainstormingMethod } from '@/lib/brainstormingMethod';
import { generateIdeasUsingScamperMethod } from '@/lib/scamperMethod';
import { generateIdeasUsingSixHatsMethod } from '@/lib/sixHatsMethod';
import { generateIdeasUsingMindMappingMethod } from '@/lib/mindMappingMethod';

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON request body
    const { prompt, method, language } = await req.json();

    // Validate the prompt
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate ideas based on the selected method
    let ideas;
    
    switch (method) {
      case 'disney':
        ideas = await generateIdeasUsingDisneyMethod(prompt, language);
        break;
      case 'brainstorming':
        ideas = await generateIdeasUsingBrainstormingMethod(prompt, language);
        break;
      case 'scamper':
        ideas = await generateIdeasUsingScamperMethod(prompt, language);
        break;
      case 'sixHats':
        ideas = await generateIdeasUsingSixHatsMethod(prompt, language);
        break;
      case 'mindMapping':
        ideas = await generateIdeasUsingMindMappingMethod(prompt, language);
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported method: ${method}` },
          { status: 400 }
        );
    }

    // Return the generated ideas
    return NextResponse.json({ ideas }, { status: 200 });
  } catch (error) {
    console.error('Error generating ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
} 