import { NextRequest, NextResponse } from 'next/server';
import { 
  TelegramMessage, 
  TelegramCallbackQuery, 
  TelegramUpdate 
} from '@/lib/telegram/types';

// Set a longer timeout for webhook processing
export const maxDuration = 25; // seconds

/**
 * Handles incoming webhook updates from Telegram
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the webhook payload
    const update: TelegramUpdate = await request.json();
    
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));
    
    // Handle different types of updates
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    
    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Handles incoming messages
 */
async function handleMessage(message: TelegramMessage) {
  // Extract message details
  const chatId = message.chat.id;
  const text = message.text || '';
  
  console.log(`Received message from ${chatId}: ${text}`);
  
  // Process commands or messages
  if (text && text.startsWith('/')) {
    const command = text.split(' ')[0].substring(1);
    await handleCommand(command, message);
  } else {
    // Regular message handling (future implementation)
  }
}

/**
 * Handles incoming callback queries (from inline buttons)
 */
async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery) {
  const data = callbackQuery.data || '';
  console.log(`Received callback query: ${data}`);
  
  // Process callback data (future implementation)
}

/**
 * Handles bot commands
 */
async function handleCommand(command: string, message: TelegramMessage) {
  const chatId = message.chat.id;
  
  switch (command) {
    case 'start':
      console.log(`User ${chatId} started the bot`);
      // Send welcome message (future implementation)
      break;
      
    case 'help':
      console.log(`User ${chatId} requested help`);
      // Send help message (future implementation)
      break;
      
    default:
      console.log(`Unknown command: ${command}`);
      // Handle unknown command (future implementation)
      break;
  }
} 