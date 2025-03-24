import {
  ActionId,
  Module,
  OnOfficeConfig,
  OnOfficeResponse,
  OnOfficeError,
  EstateReadParameters,
  EstateRecord,
  EstateListResponse,
  AddressReadParameters,
  RelationType,
  ReadRelationshipParameters,
  CreateRelationshipParameters,
  Relationship
} from './types';

import { CacheInterface, MemoryCache } from './cache';
import { 
  SDKException, 
  ApiCallFaultyResponseException, 
  ApiCallNoActionParametersException,
  HttpFetchNoResultException 
} from './exceptions';

export class OnOfficeSDK {
  private readonly config: Required<OnOfficeConfig>;
  private static readonly API_BASE = 'https://api.onoffice.de/api/';
  private cache: CacheInterface | null = null;
  private pendingRequests: Map<string, any> = new Map();
  private responseData: Map<string, any> = new Map();
  private errorData: Map<string, Error> = new Map();

  constructor(config: OnOfficeConfig) {
    this.config = {
      apiVersion: 'stable',
      apiUrl: `${OnOfficeSDK.API_BASE}${config.apiVersion || 'stable'}/api.php`,
      cacheOptions: { enabled: false, expiration: 300 },
      ...config
    };

    // Initialize cache if enabled
    if (this.config.cacheOptions?.enabled) {
      this.cache = new MemoryCache({
        expiration: this.config.cacheOptions.expiration
      });
    }
  }

  /**
   * Generate HMAC for API authentication
   */
  private async generateHmac(actionId: string, resourceType: string): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `timestamp${timestamp}token${this.config.token}resourcetype${resourceType}actionid${actionId}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const key = encoder.encode(this.config.secret);

    try {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
      throw new SDKException(`Failed to generate HMAC: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Makes a request to the API
   */
  private async makeRequest<T>(
    actionId: ActionId,
    resourceType: Module,
    resourceId: string = '',
    identifier: string = '',
    parameters: Record<string, any> = {}
  ): Promise<OnOfficeResponse<T>> {
    const timestamp = Math.floor(Date.now() / 1000);
    const hmac = await this.generateHmac(actionId, resourceType);
    
    // Create full request parameters for cache key
    const requestParams = {
      actionid: actionId,
      resourcetype: resourceType,
      resourceid: resourceId,
      identifier: identifier,
      parameters: parameters
    };
    
    // Check cache if enabled
    if (this.cache) {
      const cachedResponse = await this.cache.getResponseByParameters(requestParams);
      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }
    }

    const requestBody = {
      token: this.config.token,
      request: {
        actions: [{
          actionid: actionId,
          resourceid: resourceId,
          identifier: identifier,
          resourcetype: resourceType,
          timestamp,
          hmac,
          hmac_version: '2',
          parameters
        }]
      }
    };

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new HttpFetchNoResultException(
          `HTTP error ${response.status}: ${response.statusText}`,
          response.status,
          this.config.apiUrl
        );
      }

      const jsonResponse = await response.json();
      
      // Check for API error
      if (jsonResponse.status && jsonResponse.status.code !== 200) {
        throw new ApiCallFaultyResponseException(
          `API error ${jsonResponse.status.code}: ${jsonResponse.status.message}`,
          jsonResponse
        );
      }
      
      // Save in cache if enabled
      if (this.cache && jsonResponse.status && jsonResponse.status.code === 200) {
        await this.cache.write(requestParams, JSON.stringify(jsonResponse));
      }
      
      return jsonResponse;
    } catch (error) {
      if (error instanceof SDKException) {
        throw error;
      }
      
      throw new SDKException(`API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Convenience method for making API calls
   */
  public async call<T = any>(
    actionId: ActionId,
    resourceType: Module,
    resourceId: string = '',
    identifier: string = '',
    parameters: Record<string, any> = {}
  ): Promise<string> {
    if (!parameters) {
      throw new ApiCallNoActionParametersException();
    }
    
    const handleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the promise to handle later
    this.pendingRequests.set(handleId, {
      actionId,
      resourceType,
      resourceId,
      identifier,
      parameters
    });
    
    return handleId;
  }

  /**
   * Convenience method for making API calls with minimum parameters
   */
  public async callGeneric<T = any>(
    actionId: ActionId,
    resourceType: Module,
    parameters: Record<string, any> = {}
  ): Promise<string> {
    return this.call(actionId, resourceType, '', '', parameters);
  }

  /**
   * Sends all pending requests to the API
   */
  public async sendRequests(token?: string, secret?: string): Promise<void> {
    if (token && secret) {
      this.config.token = token;
      this.config.secret = secret;
    }
    
    const promises: Promise<void>[] = [];
    
    for (const [handleId, request] of this.pendingRequests.entries()) {
      const promise = this.makeRequest(
        request.actionId,
        request.resourceType,
        request.resourceId,
        request.identifier,
        request.parameters
      )
        .then(response => {
          this.responseData.set(handleId, response);
        })
        .catch(error => {
          this.errorData.set(handleId, error);
        });
      
      promises.push(promise);
    }
    
    await Promise.all(promises);
    
    // Clear pending requests
    this.pendingRequests.clear();
  }

  /**
   * Gets the response for a specific request handle
   */
  public getResponseArray<T = any>(handleId: string): OnOfficeResponse<T> | null {
    const response = this.responseData.get(handleId);
    
    if (!response) {
      const error = this.errorData.get(handleId);
      if (error) {
        throw error;
      }
      return null;
    }
    
    return response;
  }

  /**
   * Gets any errors that occurred during API requests
   */
  public getErrors(): Map<string, Error> {
    return this.errorData;
  }

  // Estate methods
  async readEstates<T = any>(parameters: EstateReadParameters = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.ESTATE, '', '', parameters);
  }

  /**
   * Retrieves all estates with specified fields
   * @param parameters Configuration for the request
   * @param batchSize Number of records to fetch per request
   * @returns Promise with all estate records
   */
  async getAllEstates(
    parameters: EstateReadParameters = {},
    batchSize = 100
  ): Promise<EstateRecord[]> {
    // Set up default parameters if not provided
    const requestParams: EstateReadParameters = {
      data: parameters.data || ['Id', 'objektnr_extern', 'objekttitel', 'objektart'],
      listlimit: batchSize,
      listoffset: 0,
      sortby: parameters.sortby,
      filter: parameters.filter,
      filterid: parameters.filterid,
      formatoutput: parameters.formatoutput
    };

    const allEstates: EstateRecord[] = [];
    let totalFetched = 0;
    let totalAvailable = 1; // Start with 1 to enter the loop

    // Paginate through all estates
    while (totalFetched < totalAvailable) {
      requestParams.listoffset = totalFetched;
      
      try {
        const response = await this.readEstates<{ records: Record<string, EstateRecord>; meta: { cntabsolute: number } }>(requestParams);
        
        // Extract records from the response
        const results = response.response.results[0];
        const records = results.data.records;
        totalAvailable = results.meta.cntabsolute;
        
        // Add records to our collection
        const estateRecords = Object.values(records);
        allEstates.push(...estateRecords);
        totalFetched += estateRecords.length;
        
        // If we didn't get a full batch, we're done
        if (estateRecords.length < batchSize) {
          break;
        }
      } catch (error) {
        throw new SDKException(`Failed to fetch estates: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return allEstates;
  }

  async createEstate<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.ESTATE, '', '', parameters);
  }

  async modifyEstate<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.ESTATE, '', '', parameters);
  }

  // Address methods
  async readAddresses<T = any>(parameters: AddressReadParameters = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.ADDRESS, '', '', parameters);
  }

  async createAddress<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.ADDRESS, '', '', parameters);
  }

  async modifyAddress<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.ADDRESS, '', '', parameters);
  }

  // Relation methods
  async getRelationships<T = any>(parameters: ReadRelationshipParameters = {}) {
    return this.makeRequest<T>(ActionId.GET, Module.RELATION, '', '', parameters);
  }

  async createRelationship<T = any>(parameters: CreateRelationshipParameters) {
    return this.makeRequest<T>(ActionId.CREATE, Module.RELATION, '', '', parameters);
  }

  async modifyRelationship<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.RELATION, '', '', parameters);
  }

  async deleteRelationship<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.DELETE, Module.RELATION, '', '', parameters);
  }

  // Search criteria methods
  async readSearchCriteria<T = any>(parameters: Record<string, any> = {}) {
    return this.makeRequest<T>(ActionId.READ, Module.SEARCHCRITERIA, '', '', parameters);
  }

  async createSearchCriteria<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.CREATE, Module.SEARCHCRITERIA, '', '', parameters);
  }

  async modifySearchCriteria<T = any>(parameters: Record<string, any>) {
    return this.makeRequest<T>(ActionId.MODIFY, Module.SEARCHCRITERIA, '', '', parameters);
  }

  // Cache methods
  async clearCache(): Promise<void> {
    if (this.cache) {
      await this.cache.clearAll();
    }
  }
} 