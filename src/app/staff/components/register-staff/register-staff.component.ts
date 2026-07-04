import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../common/services/session.service';
import { MessageService } from '../../../common/services/message.service';
import { EmailValidator } from '../../../common/validators/email.validator';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AppConfigService } from '../../../common/app-config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { typedFormGroup } from '../../../common/util/typed-forms';
import { BadgrApiFailure } from '../../../common/services/api-failure';
import { RegisterStaffModel } from '../../models/register-staff-model.type';
import { StaffManager } from '../../services/staff-manager.service';
import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';

@Component({
	selector: 'register-staff',
	templateUrl: './register-staff.component.html',
})
export class RegisterStaffComponent extends BaseAuthenticatedRoutableComponent implements OnInit {
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
		protected title: Title,
		protected messageService: MessageService,
		protected configService: AppConfigService,
		protected sessionService: SessionService,
		protected staffManager: StaffManager,
		protected sanitizer: DomSanitizer,
		router: Router,
		route: ActivatedRoute
	) {
		super(router, route, sessionService);
		this.title.setTitle(`Register staff`);
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

		this.signupFinished = this.staffManager.submitStaffRegistration(signupUser)
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
