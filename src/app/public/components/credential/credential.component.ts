import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { preloadImageURL } from '../../../common/util/file-util';
import { CredentialType, PublicApiService } from '../../services/public-api.service';
import { LoadedRouteParam } from '../../../common/util/loaded-route-param';
import { PublicApiCredential } from '../../models/public-api.model';
import { QueryParametersService } from '../../../common/services/query-parameters.service';
import { MessageService } from '../../../common/services/message.service';
import { AppConfigService } from '../../../common/app-config.service';
import { Title } from '@angular/platform-browser';
import { VerifyBadgeDialog } from '../verify-badge-dialog/verify-badge-dialog.component';

@Component({
	templateUrl: './credential.component.html'
})
export class PublicCredentialComponent {

	constructor(
		private injector: Injector,
		public messageService: MessageService,
		public configService: AppConfigService,
		public queryParametersService: QueryParametersService,
		private title: Title

	) {
		title.setTitle(`Credential - ${this.configService.theme['serviceName'] || "Badgr"}`);
		this.credentialIdParam = this.createLoadedRouteParam();
	}

	readonly issuerImagePlacholderUrl = preloadImageURL(require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string);

	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;

	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	@ViewChild('verifyBadgeDialog')
	verifyBadgeDialog: VerifyBadgeDialog;

	credentialIdParam: LoadedRouteParam<PublicApiCredential>;

	credentialId: string;

	credentialType: CredentialType;

	tense = {
		'expires': {
			'=1' : 'Expired',
			'=0' : 'Expires',
		},
	};

	get credential(): PublicApiCredential {
		return this.credentialIdParam.value;
	}

	get isExpired(): boolean {
		return !this.credential.validUntil || new Date(this.credential.validUntil) < new Date();
	}

	private get rawJsonUrl() {
		switch (this.credentialType) {
			case "academic":
				return `${this.configService.apiConfig.baseUrl}/academicCertificates/${this.credentialId}.json`;

			case "degree":
				return `${this.configService.apiConfig.baseUrl}/degreeCertificates/${this.credentialId}.json`;

			case "experience":
				return `${this.configService.apiConfig.baseUrl}/experienceCertificates/${this.credentialId}.json`;
		}
	}

	onVerifiedCredential(){
		this.credentialIdParam = this.createLoadedRouteParam();
	}

	verifyCredential() {
		this.verifyBadgeDialog.openDialog(this.credential, this.credentialId, this.credentialType);
	}

	private createLoadedRouteParam() {
		return new LoadedRouteParam(
			this.injector.get(ActivatedRoute),
			"credentialId",
			credentialId  => {
				const route = this.injector.get(ActivatedRoute);

        		this.credentialType = route.snapshot.params.typeId as CredentialType;
				this.credentialId = credentialId;
				
				const service: PublicApiService = this.injector.get(PublicApiService);
				return service.getCredential(this.credentialType, credentialId).then(credential => {
					return credential;
				});
			}
		);
	}
}
