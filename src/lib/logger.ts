/**
 * Simple logger utility that wraps console methods with prefixes
 */
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`ℹ️ ${message}`, ...args);
  },
  
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`⚠️ ${message}`, ...args);
  },
  
  error: (message: string, ...args: unknown[]) => {
    console.error(`❌ ${message}`, ...args);
  },
  
  debug: (message: string, ...args: unknown[]) => {
    console.debug(`🐞 ${message}`, ...args);
  }
}; 