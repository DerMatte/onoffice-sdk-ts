import {
  ActionId,
  Module,
  OnOfficeConfig,
  OnOfficeResponse,
  OnOfficeError
} from './types';

export class OnOfficeSDK {
  private readonly config: Required<OnOfficeConfig>;
  private static readonly API_BASE = 'https://api.onoffice.de/api/';

  constructor(config: OnOfficeConfig) {
    this.config = {
      apiVersion: 'stable',
      apiUrl: `${OnOfficeSDK.API_BASE}${config.apiVersion || 'stable'}/api.php`,
      ...config
    };
  }

  private async generateHmac(actionId: string, resourceType: string): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `timestamp${timestamp}token${this.config.token}resourcetype${resourceType}actionid${actionId}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const key = encoder.encode(this.config.secret);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  private async makeRequest<T>(
    actionId: ActionId,
    resourceType: Module,
    parameters: Record<string, any> = {}
  ): Promise<OnOfficeResponse<T>> {
    const timestamp = Math.floor(Date.now() / 1000);
    const hmac = await this.generateHmac(actionId, resourceType);

    const requestBody = {
      token: this.config.token,
      request: {
        actions: [{
          actionid: actionId,
          resourceid: '',
          identifier: '',
          resourcetype: resourceType,
          timestamp,
          hmac,
          hmac_version: '2',
          parameters
        }]
      }
    };

    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error: OnOfficeError = await response.json();
      throw new Error(`API Error: ${error.status.message}`);
    }

    return response.json();
  }

  // Estate methods
  async readEstates<T = any>(parameters: Record<string, any> = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.ESTATE, parameters);
  }

  async createEstate<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.ESTATE, parameters);
  }

  async modifyEstate<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.ESTATE, parameters);
  }

  // Address methods
  async readAddresses<T = any>(parameters: Record<string, any> = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.ADDRESS, parameters);
  }

  async createAddress<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.ADDRESS, parameters);
  }

  async modifyAddress<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.ADDRESS, parameters);
  }

  // Search criteria methods
  async readSearchCriteria<T = any>(parameters: Record<string, any> = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.SEARCHCRITERIA, parameters);
  }

  async createSearchCriteria<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.SEARCHCRITERIA, parameters);
  }

  async modifySearchCriteria<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.SEARCHCRITERIA, parameters);
  }
} 