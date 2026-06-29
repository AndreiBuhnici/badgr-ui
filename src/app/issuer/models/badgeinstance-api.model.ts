import {ApiEntityRef} from '../../common/model/entity-ref';

export type BadgeInstanceSlug = string;
export type BadgeInstanceUrl = string;
export interface BadgeInstanceRef extends ApiEntityRef {}

export interface AcademicCertificateForCreation {
	grade: number;
	userId: string;
	courseId: string;
}

export interface DegreeCertificateForCreation {
	grade: number;
	userId: string;
	name: string;
	degreeType: string;
}

export interface ExperienceCertificateForCreation {
	userId: string;
	description: string;
}

export interface ApiCredential {
    credentialId: string;

    achievementId: string;
    achievementType: string;
    achievementName: string;
    achievementDescription: string;
    achievementImage?: string;
    achievementCriteria?: any;
    achievementAlignment: any[];
    achievementTag: any[];

    recipientId: string;

    issuerDid: string;
    universityId: string;

    revocationListId: string;
    revocationListIndex: number;

    validFrom: string;
    validUntil?: string;

    signature?: any;
}