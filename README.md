# onOffice SDK for TypeScript

A TypeScript SDK for interacting with the onOffice API. This SDK provides a type-safe way to interact with the onOffice API, handling authentication, request formatting, and response parsing.

## Disclaimer
This SDK has not been validated or tested. Use on your own risk. Thanks


## Features

- **Complete API Coverage**: Support for all onOffice API endpoints
- **Type-Safe**: Full TypeScript type definitions
- **Caching**: Optional in-memory caching to reduce API calls
- **Exception Handling**: Comprehensive error handling
- **Relationships**: Support for entity relationships
- **Automatic Pagination**: Helper methods for retrieving all records

## Installation

```bash
pnpm add onoffice-sdk-ts
```

## Quick Start

```typescript
import { OnOfficeSDK } from 'onoffice-sdk-ts';

// Initialize the SDK
const sdk = new OnOfficeSDK({
  token: 'your-api-token',
  secret: 'your-api-secret',
  apiVersion: 'stable', // or 'latest'
  cacheOptions: {
    enabled: true,
    expiration: 300 // 5 minutes
  }
});
```

## Estate Operations

### Fetching All Estates

This SDK provides a specialized method for easily retrieving all estates, handling pagination automatically:

```typescript
// Get all estates with default fields
const allEstates = await sdk.getAllEstates();

// Get all estates with custom fields
const allEstatesWithCustomFields = await sdk.getAllEstates({
  data: [
    'Id',
    'objektnr_extern',
    'objekttitel',
    'objektart',
    'kaufpreis',
    'warmmiete',
    'wohnflaeche',
    'plz',
    'ort'
  ]
});

// With filtering - only active estates with price under 500,000
const filteredEstates = await sdk.getAllEstates({
  data: ['Id', 'objekttitel', 'kaufpreis'],
  filter: {
    status: [{ op: '=', val: 1 }],
    kaufpreis: [{ op: '<', val: 500000 }]
  },
  sortby: {
    'kaufpreis': 'ASC'
  }
});
```

### Single Request for Estates

For more control over pagination:

```typescript
// Single request with limit
const estateResponse = await sdk.readEstates({
  data: ['Id', 'objekttitel', 'kaufpreis'],
  listlimit: 100,
  listoffset: 0
});

// Access the results
const estatesData = estateResponse.response.results[0].data;
const totalRecords = estateResponse.response.results[0].meta.cntabsolute;
```

## Relationship Operations

The SDK provides complete support for handling relationships between entities:

```typescript
// Get relationships for an estate
const relationships = await sdk.getRelationships({
  relationtypes: [RelationType.OWNER],
  parentmodule: 'estate',
  parentid: '12345'
});

// Create a relationship
const createRelation = await sdk.createRelationship({
  relationtype: RelationType.OWNER,
  parentmodule: 'estate',
  parentid: '12345',
  childmodule: 'address',
  childid: '67890',
  relationdata: {
    comment: 'Property owner'
  }
});
```

## Caching

The SDK includes an in-memory cache to reduce API calls:

```typescript
// Enable caching
const sdk = new OnOfficeSDK({
  token: 'your-token',
  secret: 'your-secret',
  cacheOptions: {
    enabled: true,
    expiration: 300 // 5 minutes
  }
});

// Clear the cache when needed
await sdk.clearCache();
```

## Error Handling

The SDK includes comprehensive error handling:

```typescript
try {
  const response = await sdk.readEstates();
} catch (error) {
  if (error instanceof ApiCallFaultyResponseException) {
    console.error('API Error:', error.message);
    console.error('Response Data:', error.getResponseData());
  } else if (error instanceof HttpFetchNoResultException) {
    console.error('HTTP Error:', error.message);
    console.error('Status Code:', error.getStatusCode());
    console.error('URL:', error.getUrl());
  } else if (error instanceof SDKException) {
    console.error('SDK Error:', error.message);
  } else {
    console.error('Unknown Error:', error);
  }
}
```

## Running the Examples

This repository includes example code to demonstrate various features:

1. Copy `.env.example` to `.env` and add your API credentials:
   ```
   ONOFFICE_TOKEN=your_api_token
   ONOFFICE_SECRET=your_api_secret
   ```

2. Run the examples:
   ```bash
   # Estate retrieval example
   pnpm example:estates
   
   # Relationship example
   pnpm example:relationships
   ```

## Environment Setup

For security, it's recommended to store your API credentials in environment variables:

```typescript
import 'dotenv/config';

const sdk = new OnOfficeSDK({
  token: process.env.ONOFFICE_TOKEN,
  secret: process.env.ONOFFICE_SECRET
});
```

## Filter and Sort Options

The SDK supports all onOffice filtering and sorting options:

### Filtering Examples:

```typescript
// Price range filter
filter: {
  kaufpreis: [
    { op: '>=', val: 100000 },
    { op: '<=', val: 500000 }
  ]
}

// Location filter
filter: {
  ort: [
    { op: '=', val: 'Berlin' }
  ]
}

// Multiple conditions
filter: {
  status: [{ op: '=', val: 1 }],
  objektart: [{ op: '=', val: 'house' }],
  anzahl_zimmer: [{ op: '>=', val: 3 }]
}
```

### Sorting Examples:

```typescript
// Sort by price ascending
sortby: {
  'kaufpreis': 'ASC'
}

// Multiple sort criteria
sortby: {
  'ort': 'ASC',
  'kaufpreis': 'DESC'
}
```

## Available Methods

### Estate Operations
- `getAllEstates(parameters?, batchSize?)`: Retrieve all estates with automatic pagination
- `readEstates(parameters)`: Single request for estates
- `createEstate(parameters)`: Create a new estate
- `modifyEstate(parameters)`: Modify an existing estate

### Address Operations
- `readAddresses(parameters)`: Read address records
- `createAddress(parameters)`: Create a new address
- `modifyAddress(parameters)`: Modify an existing address

### Relationship Operations
- `getRelationships(parameters)`: Get relationships between entities
- `createRelationship(parameters)`: Create a new relationship
- `modifyRelationship(parameters)`: Modify an existing relationship
- `deleteRelationship(parameters)`: Delete a relationship

### Search Criteria Operations
- `readSearchCriteria(parameters)`: Read search criteria
- `createSearchCriteria(parameters)`: Create new search criteria
- `modifySearchCriteria(parameters)`: Modify existing search criteria

### Cache Operations
- `clearCache()`: Clear the in-memory cache

### Legacy API Call Methods
- `call(actionId, resourceType, resourceId, identifier, parameters)`: Make a raw API call
- `callGeneric(actionId, resourceType, parameters)`: Make a raw API call with minimal parameters
- `sendRequests(token?, secret?)`: Send all pending requests
- `getResponseArray(handleId)`: Get response for a specific request
- `getErrors()`: Get errors that occurred during API requests

## API Configuration

```typescript
interface OnOfficeConfig {
  token: string;      // Your API token
  secret: string;     // Your API secret
  apiVersion?: 'stable' | 'latest';  // API version to use
  apiUrl?: string;    // Optional custom API URL
  cacheOptions?: {
    enabled?: boolean;   // Enable/disable caching
    expiration?: number; // Cache expiration in seconds
  }
}
```

## Security Notes

- Never expose your API secret in client-side code
- Store sensitive credentials in environment variables
- Use HTTPS for all API communications
- The SDK automatically handles HMAC authentication

## License

MIT License 
