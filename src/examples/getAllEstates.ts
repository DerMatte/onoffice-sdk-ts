import { OnOfficeSDK } from '../OnOfficeSDK';
import { EstateRecord } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function getAllEstatesExample() {
  // Get API credentials from environment variables
  const token = process.env.ONOFFICE_TOKEN;
  const secret = process.env.ONOFFICE_SECRET;
  
  if (!token || !secret) {
    console.error('Error: ONOFFICE_TOKEN and ONOFFICE_SECRET environment variables must be set');
    console.error('Create a .env file based on .env.example with your API credentials');
    process.exit(1);
  }

  // Initialize the SDK with your credentials
  const sdk = new OnOfficeSDK({
    token,
    secret,
    apiVersion: 'stable' // or 'latest' for beta features
  });

  try {
    console.log('Fetching all estates...');
    
    // Request a comprehensive set of fields to demonstrate
    const estates = await sdk.getAllEstates({
      data: [
        'Id',
        'objektnr_extern',
        'objekttitel',
        'objektart',
        'objekttyp',
        'vermarktungsart',
        'plz',
        'ort',
        'land',
        'kaufpreis',
        'warmmiete',
        'kaltmiete',
        'wohnflaeche',
        'grundstuecksflaeche',
        'nutzflaeche',
        'anzahl_zimmer',
        'anzahl_badezimmer',
        'baujahr',
        'balkon_terrasse',
        'objektbeschreibung',
        'lage_beschr',
        'ausstatt_beschr'
      ],
      // Optional: Add filtering
      filter: {
        // Example: Only active estates
        status: [{ op: '=', val: 1 }]
        // Uncomment to add price filter
        // kaufpreis: [{ op: '<', val: 500000 }]
      },
      // Optional: Add sorting
      sortby: {
        'objektart': 'ASC',
        'kaufpreis': 'ASC'
      }
    });

    console.log(`Successfully retrieved ${estates.length} estates`);
    
    // Display summary of retrieved estates
    console.log('\nSummary of retrieved estates:');
    console.log('-----------------------------');
    estates.slice(0, 5).forEach((estate: EstateRecord, index: number) => {
      console.log(`${index + 1}. ${estate.objekttitel || 'Unnamed Estate'} (ID: ${estate.Id})`);
      console.log(`   Type: ${estate.objektart || 'N/A'} - ${estate.objekttyp || 'N/A'}`);
      console.log(`   Location: ${estate.ort || 'N/A'}, ${estate.land || 'N/A'}`);
      console.log(`   Price: ${estate.kaufpreis ? `${estate.kaufpreis} ${estate.waehrung || 'EUR'}` : 'N/A'}`);
      console.log('');
    });
    
    if (estates.length > 5) {
      console.log(`... and ${estates.length - 5} more estates`);
    }
    
    // Optional: Save the results to a JSON file
    const outputDir = path.join(__dirname, '../../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'estates.json');
    fs.writeFileSync(outputFile, JSON.stringify(estates, null, 2));
    console.log(`\nFull results saved to ${outputFile}`);
    
  } catch (error) {
    console.error('Error fetching estates:', error instanceof Error ? error.message : error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  getAllEstatesExample().catch(console.error);
} 