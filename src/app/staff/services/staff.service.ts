import {Injectable} from '@angular/core';
import {AppConfigService} from '../../common/app-config.service';
import {HttpClient} from '@angular/common/http';
import { RegisterStaffModel } from '../models/registerStaff-model.type';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { SessionService } from '../../common/services/session.service';
import { MessageService } from '../../common/services/message.service';

@Injectable()
export class StaffService extends BaseHttpApiService {
	
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
}
