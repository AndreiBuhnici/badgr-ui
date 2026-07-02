import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { SessionService } from '../../../common/services/session.service';
import { BaseRoutableComponent } from '../../../common/pages/base-routable.component';
import { MessageService } from '../../../common/services/message.service';
import { EmailValidator } from '../../../common/validators/email.validator';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AppConfigService } from '../../../common/app-config.service';
import { OAuthManager } from '../../../common/services/oauth-manager.service';
import { HttpErrorResponse } from '@angular/common/http';
import { typedFormGroup } from '../../../common/util/typed-forms';
import { BadgrApiFailure } from '../../../common/services/api-failure';
import { RegisterStaffModel } from '../../models/registerStaff-model.type';

@Component({
	selector: 'registerStaff',
	templateUrl: './registerStaff.component.html',
})
export class RegisterStaffComponent extends BaseRoutableComponent implements OnInit {
	signupForm = typedFormGroup()
		.addControl('email', '', [
			Validators.required,
			EmailValidator.validEmail
		])
		.addControl('username', '', Validators.required)
		.addControl('password', '', [ Validators.required, Validators.minLength(8) ])
		.addControl('role', '', [ Validators.required ])
	;

	signupFinished: Promise<unknown>;

	get theme() {
		return this.configService.theme;
	}

	readonly roles: { [key: string]: string } = {
		issuer: "Issuer",
		verifier: "Verifier",
		employer: "Employer",
		student: "Student"
	};

	constructor(
		fb: FormBuilder,
		private title: Title,
		public messageService: MessageService,
		private configService: AppConfigService,
		public sessionService: SessionService,
		public staffService: StaffService,
		public oAuthManager: OAuthManager,
		private sanitizer: DomSanitizer,
		router: Router,
		route: ActivatedRoute
	) {
		super(router, route);
		title.setTitle(`Register staff`);
	}

	sanitize(url:string){
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

	ngOnInit() {
		super.ngOnInit();
	}

	onSubmit() {
		if (!this.signupForm.markTreeDirtyAndValidate()) {
			return;
		}

		const formState = this.signupForm.value;

		const signupUser = new RegisterStaffModel(
			formState.email,
			formState.username,
			formState.password,
			formState.role
		);

		this.signupFinished = this.staffService.submitStaffRegistration(signupUser)
			.then(() => {
				this.messageService.setMessage(
					"Account created successfully.",
					"success"
				);
			})
			.catch((response: HttpErrorResponse) => {

				const error = response.error;
				const throttleMsg = BadgrApiFailure.messageIfThrottableError(error);

				if (throttleMsg) {
					this.messageService.reportHandledError(throttleMsg, error);
					return;
				}

				if (response.status === 409) {
					this.messageService.setMessage(
						error && error.message ? error.message : "A user with this username or email already exists.",
						"error"
					);
					return;
				}

				if (response.status === 400) {
					this.messageService.setMessage(
						error && error.message ? error.message : "Please complete all required fields.",
						"error"
					);
					return;
				}

				if (error && error.password) {
					this.messageService.setMessage(
						"The password must be uncommon and at least 8 characters long.",
						"error"
					);
					return;
				}

				this.messageService.setMessage(
					error && error.message ? error.message : "Unable to register.",
					"error"
				);

			})
			.then(() => {
				this.signupFinished = null;
			});
	}
}
