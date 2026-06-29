import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {EmailValidator} from '../../../common/validators/email.validator';
import {MessageService} from '../../../common/services/message.service';
import {SessionService} from '../../../common/services/session.service';
import { DomSanitizer, Title } from '@angular/platform-browser';

import {CommonDialogsService} from '../../../common/services/common-dialogs.service';
import {BaseAuthenticatedRoutableComponent} from '../../../common/pages/base-authenticated-routable.component';
import {BadgrApiFailure} from '../../../common/services/api-failure';
import { ExternalAuthProvider } from '../../../common/model/user-profile-api.model';
import {UserProfileManager} from '../../../common/services/user-profile-manager.service';
import {UserProfile} from '../../../common/model/user-profile.model';
import {Subscription} from 'rxjs';
import {QueryParametersService} from '../../../common/services/query-parameters.service';
import {OAuthApiService} from '../../../common/services/oauth-api.service';
import {AppConfigService} from '../../../common/app-config.service';
import {typedFormGroup} from '../../../common/util/typed-forms';
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { animationFramePromise } from "../../../common/util/promise-util";

@Component({
	selector: 'userProfile',
	templateUrl: './profile.component.html'
})
export class ProfileComponent extends BaseAuthenticatedRoutableComponent implements OnInit {
	emailForm = typedFormGroup()
		.addControl("email", "", [ Validators.required, EmailValidator.validEmail ])
	;

	profile: UserProfile;

	profileLoaded: Promise<unknown>;
	// isMoveInProgress = false;
	// menuOpen = false;

	constructor(
		router: Router,
		route: ActivatedRoute,
		sessionService: SessionService,
		protected formBuilder: FormBuilder,
		protected title: Title,
		protected messageService: MessageService,
		protected profileManager: UserProfileManager,
		protected dialogService: CommonDialogsService,
		protected paramService: QueryParametersService,
		protected configService: AppConfigService,
		private oauthService: OAuthApiService,
		private sanitizer: DomSanitizer,
	) {
		super(router, route, sessionService);
		title.setTitle(`Profile - ${this.configService.theme['serviceName'] || "Badgr"}`);

		this.profileLoaded = this.profileManager.userProfilePromise.then(
			profile => {
				this.profile = profile;
			},
			error => this.messageService.reportAndThrowError(
				"Failed to load userProfile", error
			)
		);
	}

	sanitize(url:string){
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

	ngOnInit() {
		super.ngOnInit();

		// Handle auth errors (e.g. when linking a new social account)
		if (this.paramService.queryStringValue("authError", true)) {
			this.messageService.reportHandledError(this.paramService.queryStringValue("authError", true), null, true);
		}
		this.paramService.clearInitialQueryParams();
	}
}
