import { createHash, createHmac } from 'crypto';

export type AuthDataMap = Map<string, string | number | undefined>;

export interface TelegramUserData {
  id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
  const result = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return result.buffer;
}

export class AuthDataValidator {
  private botToken: string;
  private inValidateDataAfter: number;

  constructor({ botToken }: { botToken: string }) {
    this.botToken = botToken;
    this.inValidateDataAfter = 86400; // 24 hours by default
  }

  /**
   * Validates the data sent by Telegram Login Widget
   */
  async validate<T extends { id: number | string } = TelegramUserData>(
    authDataMap: AuthDataMap
  ): Promise<T> {
    try {
      // Check required fields
      const hash = authDataMap.get('hash') as string;
      const authDate = authDataMap.get('auth_date') as number;
      const id = authDataMap.get('id');

      if (!hash || !authDate || !id) {
        throw new Error('Invalid! Incomplete data provided.');
      }

      // Check if data is expired
      const now = Math.floor(Date.now() / 1000);
      if (now - Number(authDate) > this.inValidateDataAfter) {
        throw new Error('Authentication data is expired');
      }

      // Create a copy without the hash
      const dataCheckMap = new Map(authDataMap);
      dataCheckMap.delete('hash');

      // Get data string
      const dataCheckString = this.getDataCheckString(dataCheckMap);

      // Create secret key
      const secretKey = createHash('sha256')
        .update(this.botToken)
        .digest();

      // Calculate hash
      const calculatedHash = createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      // Verify hash
      if (calculatedHash !== hash) {
        throw new Error('Data integrity check failed');
      }

      // Return data as object
      return Object.fromEntries(authDataMap.entries()) as T;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  /**
   * Creates a string for data verification
   */
  private getDataCheckString(authDataMap: AuthDataMap): string {
    const dataToCheck: string[] = [];

    for (const [key, value] of authDataMap.entries()) {
      if (value !== undefined) {
        dataToCheck.push(`${key}=${value}`);
      }
    }
    
    // Sort alphabetically as required by Telegram
    dataToCheck.sort();

    return dataToCheck.join('\n');
  }
} 