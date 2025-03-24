import { SDKException } from './SDKException';

/**
 * Exception thrown when action parameters are missing
 */
export class ApiCallNoActionParametersException extends SDKException {
  constructor(message: string = 'No action parameters specified') {
    super(message);
    this.name = 'ApiCallNoActionParametersException';
    
    // This line is needed to fix the prototype chain in TypeScript
    Object.setPrototypeOf(this, ApiCallNoActionParametersException.prototype);
  }
} 