export enum ActionId {
  READ = 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
  CREATE = 'urn:onoffice-de-ns:smart:2.5:smartml:action:create',
  MODIFY = 'urn:onoffice-de-ns:smart:2.5:smartml:action:modify',
  GET = 'urn:onoffice-de-ns:smart:2.5:smartml:action:get',
  DO = 'urn:onoffice-de-ns:smart:2.5:smartml:action:do',
  DELETE = 'urn:onoffice-de-ns:smart:2.5:smartml:action:delete'
}

export enum Module {
  ADDRESS = 'address',
  ESTATE = 'estate',
  SEARCHCRITERIA = 'searchcriteria'
}

export enum RelationType {
  BUYER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:buyer',
  TENANT = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:renter',
  OWNER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner',
  CONTACT_BROKER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPerson',
  CONTACT_PERSON = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPersonAll',
  COMPLEX_ESTATE_UNITS = 'urn:onoffice-de-ns:smart:2.5:relationTypes:complex:estate:units',
  ESTATE_ADDRESS_OWNER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner'
}

export interface OnOfficeConfig {
  token: string;
  secret: string;
  apiVersion?: 'stable' | 'latest';
  apiUrl?: string;
}

export interface OnOfficeResponse<T = any> {
  status: {
    code: number;
    message: string;
  };
  response: {
    results: Array<{
      data: T;
      meta: {
        cntabsolute: number;
      };
    }>;
  };
}

export interface OnOfficeError {
  status: {
    code: number;
    message: string;
  };
}

export interface EstateData {
  Id: string;
  kaufpreis?: number;
  lage?: string;
  objekttitel?: string;
  objektart?: string;
  objekttyp?: string;
  vermarktungsart?: string;
  plz?: string;
  ort?: string;
  land?: string;
  objektnr_extern?: string;
  waehrung?: string;
  warmmiete?: number;
  kaltmiete?: number;
  wohnflaeche?: number;
  grundstuecksflaeche?: number;
  nutzflaeche?: number;
  anzahl_zimmer?: number;
  anzahl_badezimmer?: number;
  baujahr?: number;
  balkon_terrasse?: boolean;
  objektbeschreibung?: string;
  ausstatt_beschr?: string;
  lage_beschr?: string;
  sonstige_angaben?: string;
}

export interface AddressData {
  KdNr: string;
  Vorname?: string;
  Name?: string;
  Strasse?: string;
  Plz?: string;
  Ort?: string;
  EMail?: string;
  Telefon1?: string;
  Telefon2?: string;
  Telefax?: string;
  Mobil?: string;
} 