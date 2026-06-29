import {forwardRef, Inject, Injectable} from '@angular/core';
import {RecipientBadgeApiService} from './recipient-badges-api.service';
import {RecipientBadgeInstance} from '../models/recipient-badge.model';
import {ApiRecipientBadgeInstance, RecipientBadgeInstanceCreationInfo} from '../models/recipient-badge-api.model';
import {StandaloneEntitySet} from '../../common/model/managed-entity-set';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';
import {EventsService} from '../../common/services/events.service';
import { ApiCredential } from '../../issuer/models/badgeinstance-api.model';

@Injectable()
export class RecipientBadgeManager {
	constructor(
		public recipientBadgeApiService: RecipientBadgeApiService,
		public eventsService: EventsService,
		@Inject(forwardRef(() => CommonEntityManager))
		public commonEntityManager: CommonEntityManager
	) {}

	listAcademicCertificates(): Promise<ApiCredential[]> {
        return this.recipientBadgeApiService.listAcademicCertificates();
    }

    listDegreeCertificates(): Promise<ApiCredential[]> {
        return this.recipientBadgeApiService.listDegreeCertificates();
    }

    listExperienceCertificates(): Promise<ApiCredential[]> {
        return this.recipientBadgeApiService.listExperienceCertificates();
    }

	createRecipientBadge(
		badgeInfo: RecipientBadgeInstanceCreationInfo
	): Promise<RecipientBadgeInstance> {
		// Ensure there aren't any null or undefined values in the request, despite not being needed, they cause validation
		// errors in the API.
		const payload: RecipientBadgeInstanceCreationInfo = Object.assign({}, badgeInfo);
		Object.keys(payload).forEach(key => {
			if (payload[key] === null || payload[key] === undefined || payload[key] === "") {
				delete payload[key];
			}
		});


		return this.recipientBadgeApiService
			.addRecipientBadge(payload);
	}
}
