import {Component, Injector} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {preloadImageURL} from '../../../common/util/file-util';
import {PublicApiService} from '../../services/public-api.service';
import {LoadedRouteParam} from '../../../common/util/loaded-route-param';
import {PublicApiBadgeCollectionWithBadgeClassAndIssuer} from '../../models/public-api.model';
import {EmbedService} from '../../../common/services/embed.service';
import {Title} from '@angular/platform-browser';
import {AppConfigService} from '../../../common/app-config.service';

@Component({
	templateUrl: 'badge-collection.component.html'
})
export class PublicBadgeCollectionComponent {
	readonly issuerImagePlacholderUrl = preloadImageURL(
		require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string
	);
	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;
	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	collectionHashParam: LoadedRouteParam<PublicApiBadgeCollectionWithBadgeClassAndIssuer>;

	constructor(
		private injector: Injector,
		public embedService: EmbedService,
		public configService: AppConfigService,
		private title: Title,
	) {
		title.setTitle(`Collection - ${this.configService.theme['serviceName'] || "Badgr"}`);

		this.collectionHashParam = new LoadedRouteParam(
			injector.get(ActivatedRoute),
			"collectionShareHash",
			paramValue => {
				const service: PublicApiService = injector.get(PublicApiService);
				return service.getBadgeCollection(paramValue);
			}
		);
	}

	getBadgeUrl(badge) {
		const baseUrl = this.configService.apiConfig.baseUrl;

		if (!badge.id.startsWith('urn:uuid')) {
			throw new Error("Not using format urn:uuid:*");
		}

		const splitUrnId = badge.id.split(':');
		const id = splitUrnId[splitUrnId.length - 1];
		return `${baseUrl}/public/assertions/${id}`;
	}

	isExpired(date: string): boolean {
		return date && (new Date(Date.parse(date)) < new Date());
	}

	get collection(): PublicApiBadgeCollectionWithBadgeClassAndIssuer { return this.collectionHashParam.value; }
}
