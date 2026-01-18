/**
 * Replit configuration and secrets
 * 
 * This file handles Replit-specific configuration and secrets management.
 * In development, these may be environment variables or local config.
 * In Replit, use Replit Secrets for sensitive values.
 */

/**
 * Get a configuration value from Replit Secrets or environment
 */
export function getConfig(key: string, defaultValue?: string): string | undefined {
  // In Replit, this would access Replit Secrets
  // For now, fall back to environment variables or defaults
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`REPLIT_${key}`] || defaultValue;
  }
  return defaultValue;
}

/**
 * Check if running in Replit environment
 */
export function isReplitEnvironment(): boolean {
  // Check for Replit-specific environment variables
  if (typeof process !== 'undefined' && process.env) {
    return !!process.env.REPL_SLUG || !!process.env.REPL_ID;
  }
  return false;
}
