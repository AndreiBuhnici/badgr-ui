import { CredentialAlignment, CredentialCriteria } from '../../common/model/credential-model';
import {ApiEntityRef} from '../../common/model/entity-ref';

export type BadgeInstanceSlug = string;
export type BadgeInstanceUrl = string;
export interface BadgeInstanceRef extends ApiEntityRef {}

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