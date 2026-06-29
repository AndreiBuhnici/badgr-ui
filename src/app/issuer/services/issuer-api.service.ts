import {BaseHttpApiService} from '../../common/services/base-http-api.service';
import {Injectable} from '@angular/core';
import {AppConfigService} from '../../common/app-config.service';
import {SessionService} from '../../common/services/session.service';
import {ApiIssuer} from '../models/issuer-api.model';
import {MessageService} from '../../common/services/message.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class IssuerApiService extends BaseHttpApiService {
	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	getIssuer() {
		return this
			.get<ApiIssuer>(`/issuer`)
			.then(r => r.body);
	}
}
