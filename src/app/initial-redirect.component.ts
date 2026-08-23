import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from './common/services/session.service';

import '../thirdparty/scopedQuerySelectorShim';

@Component({
	selector: 'initial-redirect',
	template: ``
})
export class InitialRedirectComponent {
	constructor(
		private sessionService: SessionService,
		private router: Router
	) {
		this.redirectUser();
	}

	private redirectUser(): void {
		if (!this.sessionService.isLoggedIn) {
			this.router.navigate(
				['/auth/login'],
				{replaceUrl: true}
			);
			return;
		}

		// Issuer takes priority if the user has both roles.
		if (this.sessionService.isAuthorizedIssuer) {
			this.router.navigate(
				['/issuer'],
				{replaceUrl: true}
			);
			return;
		}

		if (this.sessionService.isApprover) {
			this.router.navigate(
				['/approver'],
				{replaceUrl: true}
			);
			return;
		}

		this.router.navigate(
			['/recipient/badges'],
			{replaceUrl: true}
		);
	}
}