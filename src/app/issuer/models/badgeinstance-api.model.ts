import {ApiEntityRef} from '../../common/model/entity-ref';

export type BadgeInstanceSlug = string;
export type BadgeInstanceUrl = string;
export interface BadgeInstanceRef extends ApiEntityRef {}

export type CredentialType = "academic" | "degree" | "experience";

export interface CredentialCriteria {
    narrative?: string;
    id?: string;
}

export interface CredentialAlignment {
    target_name: string;
    target_url: string;
    target_description?: string;
    target_framework?: string;
    target_code?: string;
    target_type?: string;
}

export interface AcademicCertificateForCreation {
    grade: number;
    userId: string;
    courseId: string;
    criteria?: CredentialCriteria;
    alignment?: CredentialAlignment[];
    tag?: string[];
    validUntil?: string | null;
    image?: string | null;
}

export interface DegreeCertificateForCreation {
    grade: number;
    userId: string;
    name: string;
    degreeType: string;
    criteria?: CredentialCriteria;
    alignment?: CredentialAlignment[];
    tag?: string[];
    validUntil?: string | null;
    image?: string | null;
}

export interface ExperienceCertificateForCreation {
    userId: string;
    description: string;
    criteria?: CredentialCriteria;
    alignment?: CredentialAlignment[];
    tag?: string[];
    validUntil?: string | null;
    image?: string | null;
}

export interface ApiCredential {
    credentialId: string;

    achievementId: string;
    achievementType: string;
    achievementName: string;
    achievementDescription: string;
    achievementImage?: string | null;
    achievementCriteria?: CredentialCriteria;
    achievementAlignment?: CredentialAlignment[];
    achievementTag?: string[];

    recipientId: string;

    issuerDid: string;
    issuerName: string;
    universityId: string;

    revocationListId: string;
    revocationListIndex: number;

    validFrom: string;
    validUntil?: string | null;

    signature?: any;
}