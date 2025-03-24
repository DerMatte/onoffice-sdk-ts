import { CacheInterface } from './CacheInterface';

interface CacheEntry {
  value: string;
  timestamp: number;
}

interface CacheOptions {
  /** Cache expiration time in seconds */
  expiration?: number;
}

/**
 * Simple in-memory cache implementation for onOffice SDK
 */
export class MemoryCache implements CacheInterface {
  private cache: Map<string, CacheEntry> = new Map();
  private expiration: number;

  /**
   * Creates a new MemoryCache instance
   * @param options Cache configuration options
   */
  constructor(options: CacheOptions = {}) {
    // Default expiration of 5 minutes
    this.expiration = options.expiration || 5 * 60;
  }

  /**
   * Generates a unique cache key from request parameters
   * @param parameters Request parameters
   * @returns Cache key string
   */
  private generateCacheKey(parameters: any): string {
    return JSON.stringify(parameters);
  }

  /**
   * Retrieves a cached HTTP response based on request parameters
   * @param parameters Request parameters used as cache key
   * @returns Cached response or null if not found
   */
  async getResponseByParameters(parameters: any): Promise<string | null> {
    const key = this.generateCacheKey(parameters);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if cache entry has expired
    const now = Math.floor(Date.now() / 1000);
    if (now - entry.timestamp > this.expiration) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  /**
   * Stores an API response in the cache
   * @param parameters Request parameters used as cache key
   * @param value API response to cache
   * @returns Boolean indicating success
   */
  async write(parameters: any, value: string): Promise<boolean> {
    const key = this.generateCacheKey(parameters);
    const now = Math.floor(Date.now() / 1000);
    
    this.cache.set(key, {
      value,
      timestamp: now
    });
    
    return true;
  }

  /**
   * Cleans up expired cache entries
   */
  async cleanup(): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.expiration) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache
   */
  async clearAll(): Promise<void> {
    this.cache.clear();
  }
}