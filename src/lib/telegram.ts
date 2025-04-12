import { createHmac } from 'crypto';
import type { ITelegramUser } from '@/types/telegram';

// Authentication validator
export type AuthDataMap = Map<string, string | number | undefined>;

// Type for validation result object
export interface ValidationResult extends Record<string, unknown> {
  id: number | string;
  first_name: string;
  auth_date: number | string;
  hash: string;
  user_data?: Record<string, unknown>;
}

export class AuthDataValidator {
  private botToken: string;
  private inValidateDataAfter: number;

  constructor({ botToken }: { botToken: string }) {
    this.botToken = botToken;
    this.inValidateDataAfter = 86400; // 24 hours by default
  }

  /**
   * Validates the data sent by Telegram Mini App
   * Following the official Telegram Mini Apps documentation approach
   */
  async validate<T extends { id: number | string } = ITelegramUser>(
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

      // 1. Create a copy without the hash
      const dataCheckMap = new Map(authDataMap);
      dataCheckMap.delete('hash');
      // Also delete signature if it exists
      dataCheckMap.delete('signature');
      // Remove any user_data field we added for internal use
      dataCheckMap.delete('user_data');

      // 2. Get data check string (sorted alphabetically and joined with newlines)
      const dataCheckString = this.getDataCheckString(dataCheckMap);
      
      // Define result object early
      const resultObj: ValidationResult = {
        id: id as number | string,
        first_name: authDataMap.get('first_name') as string,
        auth_date: Number(authDate),
        hash
      };
      
      // Try both methods of validation
      let isValid = false;
      
      try {
        // Method 1: Telegram Mini App validation with WebAppData key
        // 3. Create secret key using HMAC-SHA256 with WebAppData as the key
        const secretKey = createHmac('sha256', 'WebAppData')
          .update(this.botToken)
          .digest();

        // 4. Calculate hash using HMAC-SHA256 with the secret key
        const calculatedHash = createHmac('sha256', secretKey)
          .update(dataCheckString)
          .digest('hex');
          
        console.log('Mini App validation - Expected:', hash, 'Calculated:', calculatedHash);
        
        if (calculatedHash === hash) {
          isValid = true;
        }
      } catch (e) {
        console.error('Error in Mini App validation method:', e);
      }
      
      // If first method failed, try alternative method
      if (!isValid) {
        try {
          // Method 2: Telegram Login Widget validation (older method)
          const secretKey = createHmac('sha256', this.botToken)
            .digest();
            
          const calculatedHash = createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
            
          console.log('Login Widget validation - Expected:', hash, 'Calculated:', calculatedHash);
          
          if (calculatedHash === hash) {
            isValid = true;
          }
        } catch (e) {
          console.error('Error in Login Widget validation method:', e);
        }
      }
      
      // If still not valid, try one more alternative for Telegram Bot API (signature)
      if (!isValid && authDataMap.get('signature')) {
        console.log('Attempting Bot API signature validation...');
        
        try {
          // For Mini Apps with both signature and hash, we need to try direct validation
          // This requires proper implementation of Ed25519 signature validation
          // with Telegram's public key
          
          // This is left as a TODO: Implement proper Ed25519 validation using a crypto library
          console.error('Ed25519 signature validation not implemented');
          // This validation will fail, which is correct until proper implementation
          isValid = false;
        } catch (e) {
          console.error('Error in Bot API signature validation method:', e);
        }
      }
      
      // Final validation check
      if (!isValid) {
        console.error('Data integrity check failed for all validation methods');
        throw new Error('Data integrity check failed');
      }
      
      // Extract user data if available
      if (authDataMap.has('user')) {
        try {
          const userValue = authDataMap.get('user') as string;
          const userData = JSON.parse(userValue);
          resultObj.user_data = userData;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Return data as object with proper type assertion
      return resultObj as unknown as T;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }

  /**
   * Creates a string for data verification
   * Format: key=value\nkey2=value2\n...
   * Sorted alphabetically as required by Telegram
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