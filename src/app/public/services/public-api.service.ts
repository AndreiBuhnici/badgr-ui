import { Injectable } from '@angular/core';
import { BaseHttpApiService } from '../../common/services/base-http-api.service';
import { SessionService } from '../../common/services/session.service';
import { AppConfigService } from '../../common/app-config.service';
import { MessageService } from '../../common/services/message.service';
import {PublicCredentialModel} from '../models/public-api.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VerificationResponse} from "../../common/model/verification-response";
import { CredentialType } from '../../common/model/credential-model';

@Injectable()
export class PublicApiService extends BaseHttpApiService {
	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	getCredential(credentialType: CredentialType, credentialId: string): Promise<PublicCredentialModel> {
		let endpoint: string;

		switch (credentialType) {
			case "academic":
				endpoint = `/academicCertificates/${credentialId}.json`;
				break;

			case "degree":
				endpoint = `/degreeCertificates/${credentialId}.json`;
				break;

			case "experience":
				endpoint = `/experienceCertificates/${credentialId}.json`;
				break;

			default:
				return Promise.reject(
					new Error(`Unknown credential type: ${credentialType}`)
				);
		}

		return this
			.get<PublicCredentialModel>(endpoint, null, false, false)
			.then(r => r.body);
	}

	verifyCredential(credentialType: CredentialType, credentialId: string): Promise<VerificationResponse> {
		let endpoint: string;
		let payload = {
			credentialId: credentialId
		};

		switch (credentialType) {
			case "academic":
				endpoint = "/academicCertificates/verify";
				break;

			case "degree":
				endpoint = "/degreeCertificates/verify";
				break;

			case "experience":
				endpoint = "/experienceCertificates/verify";
				break;

			default:
				return Promise.reject(
					new Error(`Unknown credential type: ${credentialType}`)
				);
		}

		return this.post<VerificationResponse>(endpoint, payload, null, new HttpHeaders(), false, false)
			.then(r => r.body);
	}
}
