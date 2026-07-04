import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {MessageService} from '../../../common/services/message.service';
import {SessionService} from '../../../common/services/session.service';
import {BaseAuthenticatedRoutableComponent} from '../../../common/pages/base-authenticated-routable.component';
import {CommonDialogsService} from '../../../common/services/common-dialogs.service';

import {RecipientBadgeManager} from '../../services/recipient-badge-manager.service';
import {preloadImageURL} from '../../../common/util/file-util';
import {ShareSocialDialogOptions} from '../../../common/dialogs/share-social-dialog/share-social-dialog.component';
import {compareDate} from '../../../common/util/date-compare';
import {AppConfigService} from '../../../common/app-config.service';
import {LinkEntry} from "../../../common/components/bg-breadcrumbs/bg-breadcrumbs.component";
import {BadgeInstance} from '../../../issuer/models/badgeinstance.model';
import {CredentialType} from '../../../common/model/credential-model';

@Component({
	selector: 'recipient-earned-badge-detail',
	templateUrl: './recipient-earned-badge-detail.component.html'
})
export class RecipientEarnedBadgeDetailComponent extends BaseAuthenticatedRoutableComponent implements OnInit {
	readonly issuerImagePlacholderUrl = preloadImageURL(require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string);
	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;
	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	credential: BadgeInstance;
	credentialLoaded: Promise<unknown>;

	now = new Date();
	compareDate = compareDate;
	tense = {
		'expires': {
			'=-1' : 'Expired',
			'=0' : 'Expires',
			'=1' : 'Expires',
		},
	};

	crumbs: LinkEntry[];

	constructor(
		router: Router,
		route: ActivatedRoute,
		loginService: SessionService,
		private recipientBadgeManager: RecipientBadgeManager,
		private title: Title,
		private messageService: MessageService,
		private dialogService: CommonDialogsService,
		private configService: AppConfigService
	) {
		super(router, route, loginService);

		this.credentialLoaded = this.recipientBadgeManager
			.getCredential(this.credentialType, this.credentialId)
			.then(credential => {
				this.credential = credential;

				this.title.setTitle(credential.achievementName);

				this.crumbs = [
					{
						title: "My Credentials",
						routerLink: ["/recipient/badges"]
					},
					{
						title: credential.achievementName
					}
				];
			})
			.catch(error =>
				this.messageService.reportAndThrowError(
					"Failed to load credential.",
					error
				)
			);
	}

	get credentialId(): string {
		return this.route.snapshot.params.id;
	}

	get credentialType(): CredentialType {
		return this.route.snapshot.params.type;
	}

	ngOnInit() {
		super.ngOnInit();
	}

	shareBadge() {
		this.dialogService.shareSocialDialog.openDialog(badgeShareDialogOptionsFor(this.credentialId, this.credentialType, this.credential.recipientId, this.sessionService.currentUserEmail));
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
}

export function badgeShareDialogOptionsFor(credentialId: string, credentialType: CredentialType, recipientId: string, recipientEmail: string): ShareSocialDialogOptions {
	return badgeShareDialogOptions({
		shareUrl: `${window.location.origin}/public/credentials/${credentialType}/${credentialId}`,
		recipientEmail: recipientEmail,
		recipientStudentId: recipientId
	});
}

interface BadgeShareOptions {
	shareUrl: string;
	recipientEmail?: string;
	recipientStudentId?: string;
}

export function badgeShareDialogOptions(options: BadgeShareOptions): ShareSocialDialogOptions {
	return {
		title: "Share Credential",
		shareUrl: options.shareUrl,
		shareIdUrl: options.shareUrl,

		recipientEmail: options.recipientEmail,
    	recipientStudentId: options.recipientStudentId,

		showRecipientOptions: true
	};
}
