import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SessionService } from '../../common/services/session.service';
import { AppConfigService } from '../../common/app-config.service';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { MessageService } from '../../common/services/message.service';
import { ApiCredential } from '../../issuer/models/badgeinstance-api.model';

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

	listAcademicCertificates(): Promise<ApiCredential[]> {
		return this
			.get<ApiCredential[]>('/academicCertificates/byUser/me')
			.then(r => r.body);
	}

	listDegreeCertificates(): Promise<ApiCredential[]> {
		return this
			.get<ApiCredential[]>('/degreeCertificates/byUser/me')
			.then(r => r.body);
	}

	listExperienceCertificates(): Promise<ApiCredential[]> {
		return this
			.get<ApiCredential[]>('/experienceCertificates/byUser/me')
			.then(r => r.body);
	}

	getAcademicCertificate(id: string): Promise<ApiCredential> {
		return this
			.get<ApiCredential>(`/academicCertificates/byUser/me?academicCertificateId=${id}`)
			.then(r => r.body);
	}

	getDegreeCertificate(id: string): Promise<ApiCredential> {
		return this
			.get<ApiCredential>(`/degreeCertificates/byUser/me?degreeCertificateId=${id}`)
			.then(r => r.body);
	}

	getExperienceCertificate(id: string): Promise<ApiCredential> {
		return this
			.get<ApiCredential>(`/experienceCertificates/byUser/me?experienceCertificateId=${id}`)
			.then(r => r.body);
	}
}
