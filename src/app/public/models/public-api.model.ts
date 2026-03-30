/**
 * TypeScript type information for a portion of the Open Badges v2.0 Specification, from
 * https://www.imsglobal.org/sites/default/files/Badges/OBv2p0/index.html
 */
import {BadgeClass} from '../../issuer/models/badgeclass.model';
import {Issuer} from '../../issuer/models/issuer.model';

export interface PublicApiBadgeAssertion {
  "@context": string[];
  type: string[];
  id: string;
  issuer: PublicApiIssuer;
  validFrom: string;
  expires?: string;
  revoked?: boolean;
  revocationReason?: string;
  image?: string;
  credentialSubject: {
    type: string;
    achievement: PublicApiBadgeClass;
    identifier: {
      type: "IdentityObject";
      hashed: boolean;
      identityType: "email" | "url" | "telephone" | "id" | string;
      identityHash: string;
      salt: string;
    };
  };
  proof: {
    type: string;
    cryptosuite: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
  sourceUrl?: string;
  hostedUrl?: string;
}

export interface PublicApiBadgeClass {
  "@context": string | string[];
  type: string;
  id: string;
  name: string;
  description: string;
  issuer?: PublicApiIssuer;
  image?: string;
  criteria: {
    narrative?: string;
	id?: string;
  } | string;
  alignment: Array<{
    frameworkName?: string;
    targetName?: string;
    targetUrl?: string;
    targetDescription?: string;
    targetFramework?: string;
    targetCode?: string;
  }>;
  tag: string[];
  sourceUrl?: string;
  hostedUrl?: string;
}

export interface PublicApiIssuer {
  "@context": string[];
  type: string;
  id: string;
  name: string;
  url: string;
  email: string;
  description?: string;
  image?: string | null;
  authentication?: string[];
  assertionMethod?: string[];
  keyAgreement?: string[];
  verificationMethod?: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }>;
}

export interface PublicApiBadgeCollectionWithBadgeClassAndIssuer {
  entityId: string;
  entityType: "SharedCollection";
  id: string;
  name: string;
  description: string;
  badges: PublicApiBadgeAssertion[];
  owner: {
    firstName: string;
    lastName: string;
  };
}