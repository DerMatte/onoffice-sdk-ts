/**
 * Interface for cache implementations in the onOffice SDK
 */
export interface CacheInterface {
    /**
     * Retrieves a cached HTTP response based on request parameters
     * @param parameters Request parameters used as cache key
     * @returns Cached response or null if not found
     */
    getResponseByParameters(parameters: any): Promise<string | null>;
  
    /**
     * Stores an API response in the cache
     * @param parameters Request parameters used as cache key
     * @param value API response to cache
     * @returns Boolean indicating success
     */
    write(parameters: any, value: string): Promise<boolean>;
  
    /**
     * Cleans up expired cache entries
     */
    cleanup(): Promise<void>;
  
    /**
     * Clears the entire cache
     */
    clearAll(): Promise<void>;
  }