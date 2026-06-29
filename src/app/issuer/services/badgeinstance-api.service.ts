import {Injectable} from '@angular/core';
import {BaseHttpApiService} from '../../common/services/base-http-api.service';
import {SessionService} from '../../common/services/session.service';
import {AppConfigService} from '../../common/app-config.service';
import {AcademicCertificateForCreation, ApiCredential, DegreeCertificateForCreation, ExperienceCertificateForCreation} from '../models/badgeinstance-api.model';
import {MessageService} from '../../common/services/message.service';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable()
export class BadgeInstanceApiService extends BaseHttpApiService {
	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	createAcademicCertificate(creationInstance: AcademicCertificateForCreation) {
		return this.post(`/store-academic-certificate`, creationInstance).then(r => r.body);
	}

	createDegreeCertificate(creationInstance: DegreeCertificateForCreation) {
		return this.post(`/store-degree-certificate`, creationInstance).then(r => r.body);
	}

	createExperienceCertificate(creationInstance: ExperienceCertificateForCreation) {
		return this.post(`/store-experience-certificate`, creationInstance).then(r => r.body);
	}
	
	listAcademicCertificates(userId?: string): Promise<ApiCredential[]> {
		const endpoint = userId
			? `/academicCertificates?userId=${encodeURIComponent(userId)}`
			: '/academicCertificates';

		return this.get<ApiCredential[]>(endpoint).then(r => r.body);
	}

	listDegreeCertificates(userId?: string): Promise<ApiCredential[]> {
		const endpoint = userId
			? `/degreeCertificates?userId=${encodeURIComponent(userId)}`
			: '/degreeCertificates';

		return this.get<ApiCredential[]>(endpoint).then(r => r.body);
	}

	listExperienceCertificates(userId?: string): Promise<ApiCredential[]> {
		const endpoint = userId
			? `/experienceCertificates?userId=${encodeURIComponent(userId)}`
			: '/experienceCertificates';

		return this.get<ApiCredential[]>(endpoint).then(r => r.body);
	}

	revokeAcademicCertificate(id: string) {
		return this.post('/academicCertificates/revoke',
			{
				"academicCertificateid": id
			}
		);
	}

	revokeDegreeCertificate(id: string) {
		return this.post('/degreeCertificates/revoke',
			{
				"degreeCertificateid": id
			}
		);
	}

	revokeExperienceCertificate(id: string) {
		return this.post('/experienceCertificates/revoke',
			{
				"experienceCertificateid": id
			}
		);
	}
}
