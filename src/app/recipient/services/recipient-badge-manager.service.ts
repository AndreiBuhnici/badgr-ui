import {forwardRef, Inject, Injectable} from '@angular/core';
import {RecipientBadgeApiService} from './recipient-badges-api.service';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';
import {EventsService} from '../../common/services/events.service';
import { BadgeInstance } from '../../issuer/models/badgeinstance.model';
import { CredentialType } from '../../issuer/models/badgeinstance-api.model';

@Injectable()
export class RecipientBadgeManager {
	constructor(
		public recipientBadgeApiService: RecipientBadgeApiService,
		public eventsService: EventsService,
		@Inject(forwardRef(() => CommonEntityManager))
		public commonEntityManager: CommonEntityManager
	) {}

	listAcademicCertificates(): Promise<BadgeInstance[]> {
		return this.recipientBadgeApiService
			.listAcademicCertificates()
			.then(credentials =>
				credentials.map(c => new BadgeInstance(this.commonEntityManager, c))
			);
	}

	listDegreeCertificates(): Promise<BadgeInstance[]> {
		return this.recipientBadgeApiService
			.listDegreeCertificates()
			.then(credentials =>
				credentials.map(c => new BadgeInstance(this.commonEntityManager, c))
			);
	}

	listExperienceCertificates(): Promise<BadgeInstance[]> {
		return this.recipientBadgeApiService
			.listExperienceCertificates()
			.then(credentials =>
				credentials.map(c => new BadgeInstance(this.commonEntityManager, c))
			);
	}

	getCredential(
		type: CredentialType,
		id: string
	): Promise<BadgeInstance> {

		switch (type) {
			case "academic":
				return this.recipientBadgeApiService
					.getAcademicCertificate(id)
					.then(c => new BadgeInstance(this.commonEntityManager, c));

			case "degree":
				return this.recipientBadgeApiService
					.getDegreeCertificate(id)
					.then(c => new BadgeInstance(this.commonEntityManager, c));

			case "experience":
				return this.recipientBadgeApiService
					.getExperienceCertificate(id)
					.then(c => new BadgeInstance(this.commonEntityManager, c));

			default:
				return Promise.reject(
					new Error(`Unknown credential type: ${type}`)
				);
		}
	}

	createRecipientBadge(credential): Promise<string> {
		// TODO: add import

		return Promise.resolve("success");
	}
}
