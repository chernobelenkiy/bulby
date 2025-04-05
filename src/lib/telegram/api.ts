import axios from 'axios';
import { TelegramMessage } from './types';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/**
 * Send a text message to a chat
 * @param chatId Chat ID to send message to
 * @param text Text of the message
 * @param options Additional options for the message
 * @returns Response from Telegram API
 */
export async function sendMessage(
  chatId: number | string,
  text: string,
  options: {
    parseMode?: 'Markdown' | 'HTML',
    disableWebPagePreview?: boolean,
    disableNotification?: boolean,
    replyToMessageId?: number,
    replyMarkup?: {
      inline_keyboard?: Array<Array<{ text: string, callback_data: string }>>,
      keyboard?: Array<Array<{ text: string }>>,
      remove_keyboard?: boolean,
      resize_keyboard?: boolean,
      one_time_keyboard?: boolean
    }
  } = {}
): Promise<TelegramMessage> {
  try {
    const { parseMode, disableWebPagePreview, disableNotification, replyToMessageId, replyMarkup } = options;
    
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: disableWebPagePreview,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
      reply_markup: replyMarkup
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Send a message with inline keyboard markup
 * @param chatId Chat ID to send message to
 * @param text Text of the message
 * @param inlineKeyboard Array of button rows
 * @returns Response from Telegram API
 */
export async function sendInlineKeyboard(
  chatId: number | string,
  text: string,
  inlineKeyboard: Array<Array<{ text: string, callback_data: string }>>
): Promise<TelegramMessage> {
  return sendMessage(chatId, text, {
    replyMarkup: {
      inline_keyboard: inlineKeyboard
    }
  });
}

/**
 * Answer a callback query
 * @param callbackQueryId Callback query ID to answer
 * @param text Text to show to the user
 * @param showAlert Whether to show an alert instead of a notification
 * @returns Response from Telegram API
 */
export async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
  showAlert?: boolean
): Promise<boolean> {
  try {
    const response = await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
      show_alert: showAlert
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error answering callback query:', error);
    throw error;
  }
} 