import {Injectable} from '@angular/core';
import {AppConfigService} from '../app-config.service';
import {BaseHttpApiService} from './base-http-api.service';
import {SessionService} from './session.service';
import {MessageService} from './message.service';
import {EventsService} from './events.service';
import {ApiUserProfile} from '../model/user-profile-api.model';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class UserProfileApiService extends BaseHttpApiService {
	constructor(
		protected sessionService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService,
		protected eventsService: EventsService
	) {
		super(sessionService, http, configService, messageService);
	}

	getProfile() {
		return this
			.get<ApiUserProfile>('/profile').then(r => r.body);
	}

	updatePassword(newPassword: string, currentPassword: string) {
		return this
			.put<ApiUserProfile>('/v1/user/profile', { 'password': newPassword, 'current_password': currentPassword })
			.then(r => r.body);
	}

	updateProfile(profile: ApiUserProfile) {
		return this
			.put<ApiUserProfile>('/v1/user/profile', profile)
			.then(r => r.body);
	}

	resendVerificationEmail(emailIdToVerify: number) {
		return this.put('/v1/user/emails/' + emailIdToVerify, { 'resend': true });
	}
}
