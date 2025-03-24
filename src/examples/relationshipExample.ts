import { OnOfficeSDK } from '../OnOfficeSDK';
import { RelationType, EstateRecord, AddressRecord } from '../types';
import 'dotenv/config';

async function relationshipExample() {
  // Initialize the SDK with caching enabled
  const sdk = new OnOfficeSDK({
    token: process.env.ONOFFICE_TOKEN || '',
    secret: process.env.ONOFFICE_SECRET || '',
    apiVersion: 'stable',
    cacheOptions: {
      enabled: true,
      expiration: 300 // 5 minutes
    }
  });

  try {
    console.log('1. Reading an estate and its owner...');
    
    // First get an estate
    const estateResponse = await sdk.readEstates({
      data: ['Id', 'objekttitel', 'objektart', 'objektnr_extern'],
      listlimit: 1
    });
    
    if (!estateResponse.response.results[0].data.records || 
        Object.keys(estateResponse.response.results[0].data.records).length === 0) {
      throw new Error('No estates found');
    }
    
    const estate = Object.values(estateResponse.response.results[0].data.records)[0] as EstateRecord;
    console.log(`Found estate: ${estate.objekttitel} (ID: ${estate.Id})`);
    
    // Get relationships for this estate
    console.log('\n2. Finding owner relationships...');
    const relationshipsResponse = await sdk.getRelationships({
      relationtypes: [RelationType.OWNER],
      parentmodule: 'estate',
      parentid: estate.Id
    });
    
    console.log('Relationship response:', JSON.stringify(relationshipsResponse, null, 2));
    
    if (!relationshipsResponse.response.results[0].data) {
      console.log('No relationships found. Creating a sample relationship...');
      
      // Get an address to use as owner
      const addressResponse = await sdk.readAddresses({
        data: ['KdNr', 'Vorname', 'Name'],
        listlimit: 1
      });
      
      if (!addressResponse.response.results[0].data.records || 
          Object.keys(addressResponse.response.results[0].data.records).length === 0) {
        throw new Error('No addresses found to create relationship');
      }
      
      const address = Object.values(addressResponse.response.results[0].data.records)[0] as AddressRecord;
      console.log(`Found address: ${address.Vorname} ${address.Name} (ID: ${address.KdNr})`);
      
      // Create a relationship
      console.log('\n3. Creating relationship between estate and address...');
      const createRelationResponse = await sdk.createRelationship({
        relationtype: RelationType.OWNER,
        parentmodule: 'estate',
        parentid: estate.Id,
        childmodule: 'address',
        childid: address.KdNr,
        relationdata: {
          comment: 'Created by TypeScript SDK example'
        }
      });
      
      console.log('Relationship created:', JSON.stringify(createRelationResponse, null, 2));
    } else {
      console.log('\n3. Relationships found:');
      console.log(JSON.stringify(relationshipsResponse.response.results[0].data, null, 2));
    }
    
    // Demonstrate cache functionality by making the same request again
    console.log('\n4. Making the same request again (should use cache)...');
    const start = Date.now();
    const cachedResponse = await sdk.getRelationships({
      relationtypes: [RelationType.OWNER],
      parentmodule: 'estate',
      parentid: estate.Id
    });
    console.log(`Request completed in ${Date.now() - start}ms`);
    
    // Clear the cache
    console.log('\n5. Clearing cache...');
    await sdk.clearCache();
    console.log('Cache cleared');
    
    // Make the request a third time
    console.log('\n6. Making the request after clearing cache...');
    const start2 = Date.now();
    await sdk.getRelationships({
      relationtypes: [RelationType.OWNER],
      parentmodule: 'estate',
      parentid: estate.Id
    });
    console.log(`Request completed in ${Date.now() - start2}ms`);
    
    console.log('\nExample completed successfully!');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  relationshipExample().catch(console.error);
} 