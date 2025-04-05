import { NextRequest, NextResponse } from 'next/server';
import {
  setWebhook,
  deleteWebhook,
  getWebhookInfo,
  updateBotCommands
} from '@/lib/telegram/webhook';

// Define bot commands
const DEFAULT_COMMANDS = [
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'Get help' },
];

/**
 * Handles webhook management actions
 */
export async function GET(request: NextRequest) {
  // Require API key for webhook management
  // This is a simple security measure to prevent unauthorized access
  // const apiKey = request.headers.get('x-api-key');
  // const configuredApiKey = process.env.WEBHOOK_API_KEY;
  
  // if (configuredApiKey && apiKey !== configuredApiKey) {
  //   return NextResponse.json(
  //     { error: 'Unauthorized' },
  //     { status: 401 }
  //   );
  // }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'set':
        const setResult = await setWebhook();
        return NextResponse.json(setResult);

      case 'delete':
        const deleteResult = await deleteWebhook();
        return NextResponse.json(deleteResult);

      case 'info':
        const infoResult = await getWebhookInfo();
        return NextResponse.json(infoResult);
        
      case 'commands':
        const commandsResult = await updateBotCommands(DEFAULT_COMMANDS);
        return NextResponse.json(commandsResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action', validActions: ['set', 'delete', 'info', 'commands'] }, 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Webhook management error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 