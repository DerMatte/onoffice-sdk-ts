import { OnOfficeSDK } from '../OnOfficeSDK';
import { EstateData } from '../types';

async function main() {
  // Initialize the SDK
  const sdk = new OnOfficeSDK({
    token: process.env.ONOFFICE_TOKEN || '',
    secret: process.env.ONOFFICE_SECRET || '',
    apiVersion: 'stable'
  });

  try {
    // Example: Read estates with specific fields
    const estateResponse = await sdk.readEstates<EstateData[]>({
      data: [
        'Id',
        'kaufpreis',
        'lage',
        'objekttitel',
        'objektart',
        'objekttyp',
        'vermarktungsart',
        'plz',
        'ort',
        'land',
        'objektnr_extern',
        'waehrung',
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
        'ausstatt_beschr',
        'lage_beschr',
        'sonstige_angaben'
      ],
      listlimit: 10,
      sortby: {
        kaufpreis: 'ASC',
        warmmiete: 'ASC'
      },
      filter: {
        status: [
          { op: '=', val: 1 }
        ],
        kaufpreis: [
          { op: '<', val: 300000 }
        ]
      }
    });

    console.log('Estate Response:', estateResponse);

    // Example: Create a new estate
    const newEstate = await sdk.createEstate({
      data: {
        objekttitel: 'Beautiful House',
        objektart: 'Haus',
        objekttyp: 'Einfamilienhaus',
        vermarktungsart: 'Kauf',
        kaufpreis: 250000,
        waehrung: 'EUR',
        wohnflaeche: 150,
        anzahl_zimmer: 5,
        plz: '12345',
        ort: 'Berlin',
        land: 'Deutschland'
      }
    });

    console.log('New Estate Created:', newEstate);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 