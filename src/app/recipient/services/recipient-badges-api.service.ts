import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SessionService } from '../../common/services/session.service';
import { AppConfigService } from '../../common/app-config.service';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { MessageService } from '../../common/services/message.service';
import {ApiRecipientBadgeInstance, RecipientBadgeInstanceCreationInfo} from '../models/recipient-badge-api.model';
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

	addRecipientBadge(
		badgeInfo: RecipientBadgeInstanceCreationInfo
	) {
		return this
			.post<ApiRecipientBadgeInstance>('/v1/earner/badges?json_format=plain', badgeInfo)
			.then(r => r.body);
	}

	saveInstance(apiModel: ApiRecipientBadgeInstance) {
		return this
			.put<ApiRecipientBadgeInstance>(`/v1/earner/badges/${apiModel.id}?json_format=plain`, apiModel)
			.then(r => r.body);
	}

	getBadgeShareUrlForProvider(objectIdUrl, shareServiceType, includeIdentifier): Promise<string> {
		const idUrl = objectIdUrl.replace(/.*\//, '');
		const include_identifier = includeIdentifier ? '&include_identifier=1' : '';
		return this
			.get<{url: string}>(`/v1/earner/share/badge/${idUrl}?provider=${shareServiceType}&source=badgr-ui&redirect=0${include_identifier}`)
			.then(r => r.body.url);
	}
}

