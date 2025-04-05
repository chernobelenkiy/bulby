import axios from 'axios';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

/**
 * Sets the webhook URL for the Telegram bot
 * @returns Response from Telegram API
 */
export const setWebhook = async () => {
  const webhookUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/api/telegram/webhook`;
  try {
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${webhookUrl}`
    );
    console.log('Webhook set response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error setting webhook:', error);
    throw error;
  }
};

/**
 * Deletes the webhook URL for the Telegram bot
 * @returns Response from Telegram API
 */
export const deleteWebhook = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API}/deleteWebhook`);
    console.log('Webhook delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
  }
};

/**
 * Gets information about the current webhook
 * @returns Response from Telegram API
 */
export const getWebhookInfo = async () => {
  try {
    const response = await axios.get(`${TELEGRAM_API}/getWebhookInfo`);
    console.log('Webhook info:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting webhook info:', error);
    throw error;
  }
};

/**
 * Updates the bot commands
 * @param commands Array of commands to set
 * @returns Response from Telegram API
 */
export const updateBotCommands = async (commands: Array<{ command: string; description: string }>) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/setMyCommands`, {
      commands,
    });
    console.log('Bot commands updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating bot commands:', error);
    throw error;
  }
}; 