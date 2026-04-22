import {Component, Injector} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {preloadImageURL} from '../../../common/util/file-util';
import {PublicApiService} from '../../services/public-api.service';
import {LoadedRouteParam} from '../../../common/util/loaded-route-param';
import {PublicApiBadgeClass, PublicApiIssuer} from '../../models/public-api.model';
import {EmbedService} from '../../../common/services/embed.service';
import {addQueryParamsToUrl, stripQueryParamsFromUrl, didWebToUrl} from '../../../common/util/url-util';
import {AppConfigService} from '../../../common/app-config.service';
import {Title} from '@angular/platform-browser';

@Component({
	templateUrl: './badgeclass.component.html'
})
export class PublicBadgeClassComponent {
	readonly issuerImagePlaceholderUrl = preloadImageURL(
		require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string
	);
	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;
	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	private issuerData: PublicApiIssuer;

	badgeIdParam: LoadedRouteParam<PublicApiBadgeClass>;
	didWebToUrl = didWebToUrl;

	constructor(
		private injector: Injector,
		public embedService: EmbedService,
		public configService: AppConfigService,
		private title: Title,
	) {
		title.setTitle(`Badge Class - ${this.configService.theme['serviceName'] || "Badgr"}`);

		this.badgeIdParam = new LoadedRouteParam(
			injector.get(ActivatedRoute),
			"badgeId",
			paramValue => {
				const service: PublicApiService = injector.get(PublicApiService);
				return service.getBadgeClass(paramValue).then(badgeClass => {
					service.getIssuerByDid(badgeClass.creator.id)
						.then(issuer => {
							this.issuerData = issuer;
						});
					
					return badgeClass;
				});
			}
		);
	}

	get badgeClass(): PublicApiBadgeClass { return this.badgeIdParam.value; }

	get issuer(): PublicApiIssuer { return this.issuerData; }

	private get rawJsonUrl() {
		return stripQueryParamsFromUrl(this.badgeClass.id) + ".json";
	}

}
