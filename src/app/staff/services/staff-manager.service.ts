import { Injectable } from '@angular/core';
import { StaffApiService } from './staff-api.service';
import { RegisterStaffModel } from '../models/register-staff-model.type';
import { CredentialModel } from '../../common/model/credential-model';

@Injectable()
export class StaffManager {

    constructor(
        public staffApiService: StaffApiService
    ) {}

    submitStaffRegistration(registerModel: RegisterStaffModel) {
        return this.staffApiService.submitStaffRegistration(registerModel);
    }

    listPending(type: string): Promise<CredentialModel[]> {
        switch (type) {
            case 'academic':
                return this.staffApiService.listPendingAcademicCertificates();
            case 'degree':
                return this.staffApiService.listPendingDegreeCertificates();
            case 'experience':
                return this.staffApiService.listPendingExperienceCertificates();
            default:
                return Promise.reject(`Unknown credential type ${type}`);
        }
    }

    approve(type: string, id: string) {
        switch (type) {
            case 'academic':
                return this.staffApiService.approveAcademicCertificate(id);
            case 'degree':
                return this.staffApiService.approveDegreeCertificate(id);
            case 'experience':
                return this.staffApiService.approveExperienceCertificate(id);
            default:
                return Promise.reject(`Unknown credential type ${type}`);
        }
    }

    reject(type: string, id: string) {
        switch (type) {
            case 'academic':
                return this.staffApiService.rejectAcademicCertificate(id);
            case 'degree':
                return this.staffApiService.rejectDegreeCertificate(id);
            case 'experience':
                return this.staffApiService.rejectExperienceCertificate(id);
            default:
                return Promise.reject(`Unknown credential type ${type}`);
        }
    }
}