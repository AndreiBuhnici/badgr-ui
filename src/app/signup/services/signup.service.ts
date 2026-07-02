import {Injectable} from '@angular/core';
import {AppConfigService} from '../../common/app-config.service';
import {SignupModel} from '../models/signup-model.type';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class SignupService {
	baseUrl: string;

	constructor(
		private http: HttpClient,
		private configService: AppConfigService
	) {
		this.baseUrl = this.configService.apiConfig.baseUrl;
	}

	submitSignup(signupModel: SignupModel) {
		const endpoint = this.baseUrl + '/auth/register';
		const payload = {
			email: signupModel.email,
			username: signupModel.username,
			password: signupModel.password
		};

		const headers = new HttpHeaders()
			.append('Content-Type', 'application/json')
			.set('Accept', '*/*');

		return this.http.post(
			endpoint,
			JSON.stringify(payload),
			{
				observe: 'body',
				responseType: 'json',
				headers
			}
		).toPromise();
	}
}
