import { Injectable } from '@angular/core';
import { BadgeInstanceApiService } from './badgeinstance-api.service';
import {
    AcademicCertificateForCreation,
    ApiCredential,
    DegreeCertificateForCreation,
    ExperienceCertificateForCreation
} from '../models/badgeinstance-api.model';

@Injectable()
export class BadgeInstanceManager {

    constructor(
        public badgeInstanceApiService: BadgeInstanceApiService
    ) {}

    createAcademicCertificate(
        creationInstance: AcademicCertificateForCreation
    ): Promise<any> {
        return this.badgeInstanceApiService.createAcademicCertificate(
            creationInstance
        );
    }

    createDegreeCertificate(
        creationInstance: DegreeCertificateForCreation
    ): Promise<any> {
        return this.badgeInstanceApiService.createDegreeCertificate(
            creationInstance
        );
    }

    createExperienceCertificate(
        creationInstance: ExperienceCertificateForCreation
    ): Promise<any> {
        return this.badgeInstanceApiService.createExperienceCertificate(
            creationInstance
        );
    }

    listAcademicCertificates(userId?: string): Promise<ApiCredential[]> {
        return this.badgeInstanceApiService.listAcademicCertificates(userId);
    }

    listDegreeCertificates(userId?: string): Promise<ApiCredential[]> {
        return this.badgeInstanceApiService.listDegreeCertificates(userId);
    }

    listExperienceCertificates(userId?: string): Promise<ApiCredential[]> {
        return this.badgeInstanceApiService.listExperienceCertificates(userId);
    }

    revokeAcademicCertificate(id: string): Promise<any> {
        return this.badgeInstanceApiService.revokeAcademicCertificate(id);
    }

    revokeDegreeCertificate(id: string): Promise<any> {
        return this.badgeInstanceApiService.revokeDegreeCertificate(id);
    }

    revokeExperienceCertificate(id: string): Promise<any> {
        return this.badgeInstanceApiService.revokeExperienceCertificate(id);
    }
}