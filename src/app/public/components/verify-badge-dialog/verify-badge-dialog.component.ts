import { BaseDialog } from '../../../common/dialogs/base-dialog';
import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { PublicCredentialModel } from '../../models/public-api.model';
import { QueryParametersService } from '../../../common/services/query-parameters.service';
import { preloadImageURL } from '../../../common/util/file-util';
import { PublicApiService } from '../../services/public-api.service';
import { MessageService } from '../../../common/services/message.service';
import { VerificationResponse } from "../../../common/model/verification-response";
import { CredentialType } from '../../../common/model/credential-model';

const sha256 = require('tiny-sha256') as (email: string) => string;

export enum AwardedState {
	'MATCH' = 'match',
	'NO_MATCH' = 'noMatch',
	'NOT_VERIFIED' = 'notVerified'
}

export enum ExpiryState {
	'EXPIRED' = 'expired',
	'NOT_EXPIRED' = 'notExpired',
	'NEVER_EXPIRES' ='neverExpires'
}

export enum RevokedState {
	'REVOKED' = 'revoked',
	'NOT_REVOKED' = 'notRevoked',
}

@Component({
	selector: 'verify-badge-dialog',
	templateUrl: './verify-badge-dialog.component.html'
})
export class VerifyBadgeDialog extends BaseDialog {
	constructor(
		componentElem: ElementRef,
		public messageService: MessageService,
		renderer: Renderer2,
		public publicApiService: PublicApiService,
		public queryParamService: QueryParametersService,
	){
		super(componentElem, renderer);
	}

	@Output() verifiedBadgeAssertion: EventEmitter<PublicCredentialModel> = new EventEmitter<PublicCredentialModel>();

	get identityStudentId(): string {
		return this.queryParamService.queryStringValue("identity__studentId");
	}

	get identityEmail(): string {
		return this.queryParamService.queryStringValue("identity__email");
	}

	get isBadgeVerified() {
		return this.signatureValid && this.credentialBlockchainDataValid 
		&& this.awardedState !== AwardedState.NO_MATCH && this.expiryState !== ExpiryState.EXPIRED 
		&& this.revokedState == RevokedState.NOT_REVOKED;
	}

	credential: PublicCredentialModel;

	signatureValid: boolean | null = null;

	credentialBlockchainDataValid: boolean | null = null;

	revoked: boolean | null = null;

	readonly issuerImagePlaceholderUrl = preloadImageURL(require('../../../../breakdown/static/images/placeholderavatar-issuer.svg') as string);

	readonly badgeLoadingImageUrl = require('../../../../breakdown/static/images/badge-loading.svg') as string;

	readonly badgeFailedImageUrl = require('../../../../breakdown/static/images/badge-failed.svg') as string;

	//exposes enums to the template
	readonly AWARDED_STATES = AwardedState;

	readonly EXPIRY_STATES = ExpiryState;

	readonly REVOKED_STATES = RevokedState;

	awardedState: AwardedState;

	expiryState: ExpiryState;

	revokedState: RevokedState;

	async openDialog(credential: PublicCredentialModel, credentialId: string, credentialType: CredentialType) {
		this.showModal();

		try {
			const instance: VerificationResponse = await this.publicApiService.verifyCredential(credentialType, credentialId);
			this.credential = credential;

			if (instance) {
				this.signatureValid = instance.signatureValid;
				this.credentialBlockchainDataValid = instance.credentialBlockchainDataValid;
				this.revoked = instance.revoked;
			} else {
				this.messageService.reportAndThrowError("Failed to verify your credential. Invalid response received.");
			}
		}
		catch(e) {
			this.closeDialog();
			this.messageService.reportAndThrowError(`Failed to verify your credential: ${e.message}`);
		}

		this.verifyCredential();
	}

	private verifyCredential(){
		this.verifyRevocation();

		if (this.credential.credentialSubject.identifier.identityType === "studentId") {
			this.verifyStudentId();
		} else if (this.credential.credentialSubject.identifier.identityType === "email") {
			this.verifyStudentEmail();
		}

		this.verifyExpiresOn();
		this.broadcastVerifiedBadgeAssertion();
	}

	private verifyRevocation() {
		if (this.revoked) {
			this.revokedState = RevokedState.REVOKED;
		} else {
			this.revokedState = RevokedState.NOT_REVOKED;
		}
	}

	private verifyStudentId() {
		if (!this.identityStudentId) {
			this.awardedState = AwardedState.NOT_VERIFIED;
		}
		else if (this.credential.credentialSubject.identifier.hashed) {

			const hashedId = "sha256$" + sha256(`${this.identityStudentId}${this.credential.credentialSubject.identifier.salt}`);

			this.awardedState =
				hashedId === this.credential.credentialSubject.identifier.identityHash
					? AwardedState.MATCH
					: AwardedState.NO_MATCH;
		}
		else {
			this.awardedState = AwardedState.MATCH;
		}
	}

	private verifyStudentEmail() {
		if (!this.identityEmail) {
			this.awardedState = AwardedState.NOT_VERIFIED;
		}
		else if (this.credential.credentialSubject.identifier.hashed) {

			const hashedEmail = "sha256$" + sha256(`${this.identityEmail}${this.credential.credentialSubject.identifier.salt}`);

			this.awardedState =
				hashedEmail === this.credential.credentialSubject.identifier.identityHash
					? AwardedState.MATCH
					: AwardedState.NO_MATCH;
		}
		else {
			this.awardedState = AwardedState.MATCH;
		}
	}

	private verifyExpiresOn() {
		if (!this.credential.validUntil) {
			this.expiryState = ExpiryState.NEVER_EXPIRES;
		} else {
			this.expiryState = new Date() > new Date(this.credential.validUntil)
			                   ? ExpiryState.EXPIRED
			                   : ExpiryState.NOT_EXPIRED;
		}
	}

	private broadcastVerifiedBadgeAssertion() {
		if (this.credential){
			this.verifiedBadgeAssertion.emit(this.credential);
		}
	}

	private closeDialog() {
		this.closeModal();
	}
}
