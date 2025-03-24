/**
 * Enum for relationship types between onOffice entities
 */
export enum RelationType {
  // Estate to address relationships
  BUYER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:buyer',
  TENANT = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:renter',
  OWNER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner',
  CONTACT_BROKER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPerson',
  CONTACT_PERSON = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPersonAll',
  
  // Complex estate relationships
  COMPLEX_ESTATE_UNITS = 'urn:onoffice-de-ns:smart:2.5:relationTypes:complex:estate:units',
  ESTATE_ADDRESS_OWNER = 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner'
}

/**
 * Interface for relationship parameters
 */
export interface RelationshipParameters {
  /** The type of relationship */
  relationtype: RelationType;
  
  /** Parent record module (e.g. 'estate') */
  parentmodule: string;
  
  /** Parent record ID */
  parentid: string;
  
  /** Child record module (e.g. 'address') */
  childmodule: string;
  
  /** Child record ID */
  childid: string;
}

/**
 * Interface for creating relationships
 */
export interface CreateRelationshipParameters extends RelationshipParameters {
  /** Optional additional data for the relationship */
  relationdata?: Record<string, any>;
}

/**
 * Interface for reading relationships
 */
export interface ReadRelationshipParameters {
  /** Array of relationship types to fetch */
  relationtypes?: RelationType[];
  
  /** Parent record module (e.g. 'estate') */
  parentmodule?: string;
  
  /** Parent record ID */
  parentid?: string;
  
  /** Child record module (e.g. 'address') */
  childmodule?: string;
  
  /** Child record ID */
  childid?: string;
}

/**
 * Interface for relationship data in responses
 */
export interface Relationship {
  relationtype: RelationType;
  parentmodule: string;
  parentid: string;
  childmodule: string;
  childid: string;
  relationdata?: Record<string, any>;
} 