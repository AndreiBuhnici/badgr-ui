import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../common/services/session.service';
import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';
import { MessageService } from '../../../common/services/message.service';
import { IssuerManager } from '../../services/issuer-manager.service';
import { BadgeInstanceManager } from '../../services/badgeinstance-manager.service';
import { Issuer } from '../../models/issuer.model';
import { ApiCredential } from '../../models/badgeinstance-api.model';
import { Title } from '@angular/platform-browser';
import { preloadImageURL } from '../../../common/util/file-util';
import { UserProfileManager } from '../../../common/services/user-profile-manager.service';
import { LinkEntry } from '../../../common/components/bg-breadcrumbs/bg-breadcrumbs.component';

@Component({
	selector: 'issuer-detail',
	templateUrl: './issuer-detail.component.html'
})
export class IssuerDetailComponent extends BaseAuthenticatedRoutableComponent implements OnInit {

	readonly issuerImagePlaceHolderUrl = preloadImageURL(
		require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string
	);

	readonly noIssuersPlaceholderSrc =
		require('../../../../../node_modules/@concentricsky/badgr-style/dist/images/image-empty-issuer.svg') as string;

	issuer: Issuer;

	academicCertificates: ApiCredential[] = [];
	degreeCertificates: ApiCredential[] = [];
	experienceCertificates: ApiCredential[] = [];

	issuerLoaded: Promise<unknown>;

	crumbs: LinkEntry[];

	filterUserId = "";

	constructor(
		loginService: SessionService,
		router: Router,
		route: ActivatedRoute,
		protected messageService: MessageService,
		protected title: Title,
		protected issuerManager: IssuerManager,
		protected badgeInstanceManager: BadgeInstanceManager,
		protected profileManager: UserProfileManager
	) {
		super(router, route, loginService);

		title.setTitle('Issuer Detail');
	}

	ngOnInit() {
		super.ngOnInit();

		this.issuerLoaded = this.issuerManager.getIssuer().then(
			(issuer) => {
				this.issuer = issuer;

				this.title.setTitle(
					`Issuer - University ${this.issuer.id}`
				);

				// Load all credentials
				this.reloadCredentials().catch(error => {
					this.messageService.reportAndThrowError(
						"Failed to load credentials.",
						error
					);
				});
			},
			(error) => {
				this.messageService.reportLoadingError(
					`Issuer does not exist.`,
					error
				);
			}
		);
	}

	get hasVisibleCredentials(): boolean {
		return (
			this.academicCertificates.length > 0 ||
			this.degreeCertificates.length > 0 ||
			this.experienceCertificates.length > 0
		);
	}

	revokeCredential(type: string, credential: ApiCredential) {
		if (
			(type === "academic" || type === "degree") &&
			!(this.isAdmin || this.isIssuer)
		) {
			return;
		}
		if (
			type === "experience" &&
			!(this.isAdmin || this.isEmployer)
		) {
			return;
		}
		let request: Promise<any>;
		switch (type) {
			case "academic":
				request = this.badgeInstanceManager.revokeAcademicCertificate(
					credential.credentialId
				);
				break;
			case "degree":
				request = this.badgeInstanceManager.revokeDegreeCertificate(
					credential.credentialId
				);
				break;
			case "experience":
				request = this.badgeInstanceManager.revokeExperienceCertificate(
					credential.credentialId
				);
				break;

			default:
				return;
		}
		request
			.then(() => {
				this.messageService.setMessage(
					"Credential revoked successfully.",
					"success"
				);
				return this.reloadCredentials();
			})
			.catch(error => {
				this.messageService.reportAndThrowError(
					"Unable to revoke credential.",
					error
				);
			});
	}

	private reloadCredentials(): Promise<void> {
		const userId = this.filterUserId.trim();

		const academicRequest =
			this.isAdmin || this.isIssuer
				? this.badgeInstanceManager.listAcademicCertificates(userId || undefined)
				: Promise.resolve([]);

		const degreeRequest =
			this.isAdmin || this.isIssuer
				? this.badgeInstanceManager.listDegreeCertificates(userId || undefined)
				: Promise.resolve([]);

		const experienceRequest =
			this.isAdmin || this.isEmployer
				? this.badgeInstanceManager.listExperienceCertificates(userId || undefined)
				: Promise.resolve([]);

		return Promise.all([
			academicRequest,
			degreeRequest,
			experienceRequest
		]).then(([academic, degree, experience]) => {
			this.academicCertificates = academic || [];
			this.degreeCertificates = degree || [];
			this.experienceCertificates = experience || [];
		});
	}

	applyFilter() {
		this.reloadCredentials();
	}
}