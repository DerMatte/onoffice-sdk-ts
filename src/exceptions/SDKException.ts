/**
 * Base exception class for onOffice SDK errors
 */
export class SDKException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SDKException';
    
    // This line is needed to fix the prototype chain in TypeScript
    Object.setPrototypeOf(this, SDKException.prototype);
  }
} 