import { Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { preloadImageURL } from '../../../common/util/file-util';
import { PublicApiService } from '../../services/public-api.service';
import { LoadedRouteParam } from '../../../common/util/loaded-route-param';
import { didWebToUrl } from '../../../common/util/url-util';

import {
	PublicApiBadgeAssertion,
	PublicApiBadgeClass,
	PublicApiIssuer
} from '../../models/public-api.model';
import { EmbedService } from '../../../common/services/embed.service';
import { routerLinkForUrl } from '../public/public.component';
import { QueryParametersService } from '../../../common/services/query-parameters.service';
import { MessageService } from '../../../common/services/message.service';
import { AppConfigService } from '../../../common/app-config.service';
import { saveAs } from 'file-saver';
import { Title } from '@angular/platform-browser';
import { VerifyBadgeDialog } from '../verify-badge-dialog/verify-badge-dialog.component';


@Component({
	templateUrl: './badge-assertion.component.html'
})
export class PublicBadgeAssertionComponent {

	constructor(
		private injector: Injector,
		public embedService: EmbedService,
		public messageService: MessageService,
		public configService: AppConfigService,
		public queryParametersService: QueryParametersService,
		private title: Title

	) {
		title.setTitle(`Assertion - ${this.configService.theme['serviceName'] || "Badgr"}`);
		this.assertionIdParam = this.createLoadedRouteParam();
	}

	readonly issuerImagePlacholderUrl = preloadImageURL(require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string);

	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;

	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	private issuerData: PublicApiIssuer;

	@ViewChild('verifyBadgeDialog')
	verifyBadgeDialog: VerifyBadgeDialog;

	assertionIdParam: LoadedRouteParam<PublicApiBadgeAssertion>;

	assertionId: string;

	awardedToDisplayName: string;	

	didWebToUrl = didWebToUrl;

	routerLinkForUrl = routerLinkForUrl;

	tense = {
		'expires': {
			'=1' : 'Expired',
			'=0' : 'Expires',
		},
	};

	get showDownload() {
		return this.queryParametersService.queryStringValue("action") === "download";
	}

	get assertion(): PublicApiBadgeAssertion {
		return this.assertionIdParam.value;
	}

	get badgeClass(): PublicApiBadgeClass {
		return this.assertion.credentialSubject.achievement;
	}

	get issuer(): PublicApiIssuer {
		return this.issuerData;
	}

	get isExpired(): boolean {
		return !this.assertion.validUntil || new Date(this.assertion.validUntil) < new Date();
	}

	private get rawUrl() {
		return `${this.configService.apiConfig.baseUrl}/public/assertions/${this.assertionId}`;
	}

	private get rawJsonUrl() {
		return `${this.rawUrl}.json`;
	}

	get rawBakedUrl() {
		return `${this.rawUrl}/baked`;
	}

	onVerifiedBadgeAssertion(){
		this.assertionIdParam = this.createLoadedRouteParam();
	}

	verifyBadge() {
		this.verifyBadgeDialog.openDialog(this.assertion);
	}

	generateFileName(assertion, fileExtension): string {
		return `${assertion.badge.name} - ${assertion.recipient.identity}${fileExtension}`;
	}

	openSaveDialog(assertion): void {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", assertion.image, true);
		xhr.responseType = "blob";
		xhr.onload = (e) => {
			if (xhr.status === 200) {
				const fileExtension = this.mimeToExtension(xhr.response.type);
				const name = this.generateFileName(assertion, fileExtension);
				saveAs(xhr.response, name);
			}
		};
		xhr.send();
	}

	mimeToExtension(mimeType: string): string {
		if (mimeType.indexOf('svg') !== -1) return ".svg";
		if (mimeType.indexOf('png') !== -1) return ".png";
		return "";
	}

	loadIssuer(did: string) {
		const service: PublicApiService = this.injector.get(PublicApiService);

		service.getIssuerByDid(did)
			.then(issuer => {
				this.issuerData = issuer;
			})
	}

	private createLoadedRouteParam() {
		return new LoadedRouteParam(
			this.injector.get(ActivatedRoute),
			"assertionId",
			paramValue => {
				this.assertionId = paramValue;
				const service: PublicApiService = this.injector.get(PublicApiService);
				return service.getBadgeAssertion(paramValue).then(assertion => {
					this.loadIssuer(assertion.issuer);

					if (this.showDownload) {
						this.openSaveDialog(assertion);
					}
					if (assertion["extensions:recipientProfile"] && assertion["extensions:recipientProfile"].name) {
						this.awardedToDisplayName = assertion["extensions:recipientProfile"].name;
					}
					return assertion;
				});
			}
		);
	}

}
