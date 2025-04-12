import { browserStorage } from './browser-storage';

const TOKEN_STORAGE_KEY = 'user-token-balance';
const TOKEN_DATE_KEY = 'user-token-last-date';
const DEFAULT_DAILY_TOKENS = 200;

// Method costs in tokens (based on number of AI calls × 10)
export const METHOD_COSTS = {
  brainstorming: 20, // 2 AI calls
  scamper: 20,       // 2 AI calls
  mindMapping: 20,   // 2 AI calls
  sixHats: 70,       // 7 AI calls
  disney: 30,        // 3 AI calls (assumed)
};

/**
 * Gets the current token balance, refreshing if a new day has started
 */
export function getTokenBalance(): number {
  // Check if it's a new day and we should refresh the balance
  const today = new Date().toDateString();
  const lastDate = browserStorage.getItem(TOKEN_DATE_KEY);
  
  if (!lastDate || lastDate !== today) {
    // It's a new day, refresh tokens
    setTokenBalance(DEFAULT_DAILY_TOKENS);
    browserStorage.setItem(TOKEN_DATE_KEY, today);
  }
  
  // Return current balance
  const balance = browserStorage.getItem(TOKEN_STORAGE_KEY);
  return balance ? parseInt(balance, 10) : DEFAULT_DAILY_TOKENS;
}

/**
 * Sets the token balance
 */
export function setTokenBalance(amount: number): void {
  browserStorage.setItem(TOKEN_STORAGE_KEY, amount.toString());
}

/**
 * Checks if user has enough tokens for a specific method
 */
export function hasEnoughTokens(method: string): boolean {
  const cost = METHOD_COSTS[method as keyof typeof METHOD_COSTS] || 10;
  const balance = getTokenBalance();
  return balance >= cost;
}

/**
 * Deducts tokens for using a specific method
 * Returns the new balance
 */
export function deductTokens(method: string): number {
  const cost = METHOD_COSTS[method as keyof typeof METHOD_COSTS] || 10;
  const currentBalance = getTokenBalance();
  
  if (currentBalance < cost) {
    throw new Error('Not enough tokens');
  }
  
  const newBalance = currentBalance - cost;
  setTokenBalance(newBalance);
  return newBalance;
} 