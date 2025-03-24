# onOffice SDK for TypeScript

A TypeScript SDK for interacting with the onOffice API. This SDK provides a type-safe way to interact with the onOffice API, handling authentication, request formatting, and response parsing.

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
  apiVersion: 'stable' // or 'latest'
});

// Read estates
const estates = await sdk.readEstates({
  data: ['Id', 'kaufpreis', 'lage'],
  listlimit: 10
});

// Create a new estate
const newEstate = await sdk.createEstate({
  data: {
    objekttitel: 'Beautiful House',
    objektart: 'Haus',
    kaufpreis: 250000
  }
});
```

## Features

- TypeScript support with full type definitions
- Modern async/await API
- Built-in error handling
- Support for all onOffice API endpoints
- HMAC authentication
- Gzip compression support
- Type-safe request and response handling

## API Reference

### Configuration

```typescript
interface OnOfficeConfig {
  token: string;      // Your API token
  secret: string;     // Your API secret
  apiVersion?: 'stable' | 'latest';  // API version to use
  apiUrl?: string;    // Optional custom API URL
}
```

### Available Methods

#### Estate Operations
- `readEstates<T>(parameters)`: Read estate records
- `createEstate<T>(parameters)`: Create a new estate
- `modifyEstate<T>(parameters)`: Modify an existing estate

#### Address Operations
- `readAddresses<T>(parameters)`: Read address records
- `createAddress<T>(parameters)`: Create a new address
- `modifyAddress<T>(parameters)`: Modify an existing address

#### Search Criteria Operations
- `readSearchCriteria<T>(parameters)`: Read search criteria
- `createSearchCriteria<T>(parameters)`: Create new search criteria
- `modifySearchCriteria<T>(parameters)`: Modify existing search criteria

### Type Definitions

The SDK includes comprehensive TypeScript definitions for:
- Estate data
- Address data
- API responses
- Error responses
- Configuration options

## Error Handling

The SDK throws errors with descriptive messages when API calls fail:

```typescript
try {
  const response = await sdk.readEstates();
} catch (error) {
  console.error('API Error:', error.message);
}
```

## Security

- Never expose your API secret in client-side code
- Store sensitive credentials in environment variables
- Use HTTPS for all API communications
- The SDK automatically handles HMAC authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details 