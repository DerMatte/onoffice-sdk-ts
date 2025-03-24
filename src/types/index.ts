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
  SEARCHCRITERIA = 'searchcriteria',
  RELATION = 'relation'
}

// Re-export relationships from dedicated file
export * from './relationships';

export interface OnOfficeConfig {
  token: string;
  secret: string;
  apiVersion?: 'stable' | 'latest';
  apiUrl?: string;
  cacheOptions?: {
    enabled?: boolean;
    expiration?: number;
  };
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
  [key: string]: any;
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
  [key: string]: any;
}

export interface EstateRecord {
  Id: string;
  [key: string]: any;
}

export interface AddressRecord {
  KdNr: string;
  [key: string]: any;
}

export interface EstateReadParameters {
  data?: string[];
  listlimit?: number;
  listoffset?: number;
  sortby?: Record<string, 'ASC' | 'DESC'>;
  filter?: Record<string, Array<{ op: string; val: any }>>;
  filterid?: string;
  formatoutput?: boolean;
}

export interface AddressReadParameters {
  data?: string[];
  listlimit?: number;
  listoffset?: number;
  sortby?: Record<string, 'ASC' | 'DESC'>;
  filter?: Record<string, Array<{ op: string; val: any }>>;
  filterid?: string;
  formatoutput?: boolean;
}

export interface EstateListResponse {
  records: EstateRecord[];
  meta: {
    cntabsolute: number;
  };
}

export interface AddressListResponse {
  records: AddressRecord[];
  meta: {
    cntabsolute: number;
  };
} 