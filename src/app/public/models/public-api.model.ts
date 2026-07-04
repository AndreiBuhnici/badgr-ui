/**
 * TypeScript type information for a portion of the Open Badges v2.0 Specification, from
 * https://www.imsglobal.org/sites/default/files/Badges/OBv2p0/index.html
 */

export interface PublicCredentialModel {
  "@context": string[];
  type: string[];
  id: string;
  credentialSubject: {
    type: string;
    achievement: {
      type: string;
      id: string;
      name: string;
      description: string;
      achievementType: string
      creator : {
        id: string;
        type: string;
        name: string;
      };
      image?: string;
      criteria?: {
        narrative?: string;
        id?: string;
      }
      alignment?: object[];
      tag?: string[];
    };
    identifier: {
      type: "IdentityObject";
      hashed: boolean;
      identityType: string;
      identityHash: string;
      salt: string;
    };
  };
  issuer: string;
  validFrom: string;
  validUntil?: string;
  proof: {
    type: string;
    cryptosuite: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}