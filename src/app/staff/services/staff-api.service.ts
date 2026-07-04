import {Injectable} from '@angular/core';
import {AppConfigService} from '../../common/app-config.service';
import {HttpClient} from '@angular/common/http';
import { RegisterStaffModel } from '../models/register-staff-model.type';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { SessionService } from '../../common/services/session.service';
import { MessageService } from '../../common/services/message.service';
import { CredentialModel } from '../../common/model/credential-model';

@Injectable()
export class StaffApiService extends BaseHttpApiService {
	
	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	submitStaffRegistration(registerModel: RegisterStaffModel) {
		return this.post('/registerStaff', registerModel).then(r => r.body);
	}

	listPendingAcademicCertificates(): Promise<CredentialModel[]> {
        return this.get<CredentialModel[]>('/academicCertificates/pending').then(r => r.body);
    }

    listPendingDegreeCertificates(): Promise<CredentialModel[]> {
        return this.get<CredentialModel[]>('/degreeCertificates/pending').then(r => r.body);
    }

    listPendingExperienceCertificates(): Promise<CredentialModel[]> {
        return this.get<CredentialModel[]>('/experienceCertificates/pending').then(r => r.body);
    }

    approveAcademicCertificate(id: string) {
        return this.post(`/academicCertificates/approve/${id}`, {});
    }

    approveDegreeCertificate(id: string) {
        return this.post(`/degreeCertificates/approve/${id}`, {});
    }

    approveExperienceCertificate(id: string) {
        return this.post(`/experienceCertificates/approve/${id}`, {});
    }

    rejectAcademicCertificate(id: string) {
        return this.post(`/academicCertificates/reject/${id}`, {});
    }

    rejectDegreeCertificate(id: string) {
        return this.post(`/degreeCertificates/reject/${id}`, {});
    }

    rejectExperienceCertificate(id: string) {
        return this.post(`/experienceCertificates/reject/${id}`, {});
    }
}
