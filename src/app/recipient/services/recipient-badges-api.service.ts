import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SessionService } from '../../common/services/session.service';
import { AppConfigService } from '../../common/app-config.service';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { MessageService } from '../../common/services/message.service';
import { CredentialModel } from '../../common/model/credential-model';

@Injectable()
export class RecipientBadgeApiService extends BaseHttpApiService {

	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	listAcademicCertificates(): Promise<CredentialModel[]> {
		return this
			.get<CredentialModel[]>('/academicCertificates/byUser/me')
			.then(r => r.body);
	}

	listDegreeCertificates(): Promise<CredentialModel[]> {
		return this
			.get<CredentialModel[]>('/degreeCertificates/byUser/me')
			.then(r => r.body);
	}

	listExperienceCertificates(): Promise<CredentialModel[]> {
		return this
			.get<CredentialModel[]>('/experienceCertificates/byUser/me')
			.then(r => r.body);
	}

	getAcademicCertificate(id: string): Promise<CredentialModel> {
		return this
			.get<CredentialModel>(`/academicCertificates/byUser/me?academicCertificateId=${id}`)
			.then(r => r.body);
	}

	getDegreeCertificate(id: string): Promise<CredentialModel> {
		return this
			.get<CredentialModel>(`/degreeCertificates/byUser/me?degreeCertificateId=${id}`)
			.then(r => r.body);
	}

	getExperienceCertificate(id: string): Promise<CredentialModel> {
		return this
			.get<CredentialModel>(`/experienceCertificates/byUser/me?experienceCertificateId=${id}`)
			.then(r => r.body);
	}

	importAcademicCertificate(credential: any): Promise<void> {
		return this
			.post<void>(
				"/academicCertificates/import",
				{ credential }
			)
			.then(r => r.body);
	}

	importDegreeCertificate(credential: any): Promise<void> {
		return this
			.post<void>(
				"/degreeCertificates/import",
				{ credential }
			)
			.then(r => r.body);
	}

	importExperienceCertificate(credential: any): Promise<void> {
		return this
			.post<void>(
				"/experienceCertificates/import",
				{ credential }
			)
			.then(r => r.body);
	}
}
