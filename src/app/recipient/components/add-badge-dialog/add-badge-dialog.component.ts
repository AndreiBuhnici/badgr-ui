import {Component, ElementRef, Renderer2} from '@angular/core';
import {RecipientBadgeManager} from '../../services/recipient-badge-manager.service';
import {JsonValidator} from '../../../common/validators/json.validator';
import {MessageService} from '../../../common/services/message.service';
import {BadgrApiFailure} from '../../../common/services/api-failure';
import {BaseDialog} from '../../../common/dialogs/base-dialog';
import {typedFormGroup} from '../../../common/util/typed-forms';
import {CredentialType} from '../../../common/model/credential-model';

@Component({
	selector: 'add-badge-dialog',
	templateUrl: './add-badge-dialog.component.html',
})
export class AddBadgeDialogComponent extends BaseDialog {
	addRecipientBadgeForm = typedFormGroup()
		.addControl("credentialType", "academic")
		.addControl("assertion", "", JsonValidator.validJson)
	;

	formError: string;

	resolveFunc: () => void = () => {};
	rejectFunc: (err?: unknown) => void;

	badgeUploadPromise: Promise<unknown>;

	readonly credentialTypes: { [key: string]: string } = {
		academic: "Academic Certificate",
		degree: "Degree Certificate",
		experience: "Experience Certificate"
	};

	constructor(
		componentElem: ElementRef,
		renderer: Renderer2,
		protected recipientBadgeManager: RecipientBadgeManager,
		protected messageService: MessageService
	) {
		super(componentElem, renderer);
	}

	openDialog(): Promise<void> {
		this.addRecipientBadgeForm.reset();
		this.formError = undefined;
		this.showModal();

		return new Promise<void>((resolve, reject) => {
			this.resolveFunc = resolve;
			this.rejectFunc = reject;
		});
	}

	closeDialog() {
		this.closeModal();
		this.resolveFunc();
	}

	submitBadgeRecipientForm() {
		const formState = this.addRecipientBadgeForm.value;

		if (formState.assertion && this.addRecipientBadgeForm.valid) {
			this.recipientBadgeManager.createRecipientBadge(JSON.parse(formState.assertion), formState.credentialType as CredentialType)
				.then(() => {
					this.messageService.reportMajorSuccess("Request to import credential was submitted. Awaiting approval.");
					this.closeDialog();
				})
				.catch(err => {

					let message = BadgrApiFailure.from(err).firstMessage;

					// display human readable description of first error if provided by server
					try {
						const jsonErr = JSON.parse(message);
						if (err.response && err.response._body) {
							const body = JSON.parse(err.response._body);
							if (body && body.length > 0 && body[0].description) {
								message = body[0].description;
							}
						} else if(jsonErr.length) {
							message = jsonErr[0].result || jsonErr[0].description;
						}
					} catch {
						// Message was not JSON.
					}

					this.messageService.reportAndThrowError(
						message
							? `Failed to request import of credential: ${message}`
							: `Credential import request failed due to an unknown error`,
						err
					);
				})
				.catch(e => {
					this.closeModal();
					this.rejectFunc(e);
				});
		} else {
			this.formError = "Please enter a valid badge JSON.";
		}
	}

	clearFormError() {
		this.formError = undefined;
	}
}
