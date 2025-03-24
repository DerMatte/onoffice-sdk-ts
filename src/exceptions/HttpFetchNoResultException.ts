import { SDKException } from './SDKException';

/**
 * Exception thrown when HTTP request fails to return a result
 */
export class HttpFetchNoResultException extends SDKException {
  private statusCode: number;
  private url: string;

  constructor(message: string, statusCode: number = 0, url: string = '') {
    super(message);
    this.name = 'HttpFetchNoResultException';
    this.statusCode = statusCode;
    this.url = url;
    
    // This line is needed to fix the prototype chain in TypeScript
    Object.setPrototypeOf(this, HttpFetchNoResultException.prototype);
  }

  /**
   * Get the HTTP status code that caused the exception
   */
  getStatusCode(): number {
    return this.statusCode;
  }

  /**
   * Get the URL that was being fetched when the exception occurred
   */
  getUrl(): string {
    return this.url;
  }
} 