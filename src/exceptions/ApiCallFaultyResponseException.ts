import { SDKException } from './SDKException';

/**
 * Exception thrown when the API response is malformed or unexpected
 */
export class ApiCallFaultyResponseException extends SDKException {
  /**
   * Response data that caused the exception
   */
  private responseData: any;

  constructor(message: string, responseData: any = null) {
    super(message);
    this.name = 'ApiCallFaultyResponseException';
    this.responseData = responseData;
    
    // This line is needed to fix the prototype chain in TypeScript
    Object.setPrototypeOf(this, ApiCallFaultyResponseException.prototype);
  }

  /**
   * Get the response data that caused the exception
   */
  getResponseData(): any {
    return this.responseData;
  }
} 