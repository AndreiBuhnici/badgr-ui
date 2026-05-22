import { BaseDialog } from '../../../common/dialogs/base-dialog';
import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { PublicApiBadgeAssertion } from '../../models/public-api.model';
import { QueryParametersService } from '../../../common/services/query-parameters.service';
import { preloadImageURL } from '../../../common/util/file-util';
import { PublicApiService } from '../../services/public-api.service';
import { MessageService } from '../../../common/services/message.service';
import { ApiV2Wrapper } from "../../../common/model/api-v2-wrapper";

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
	'NOT_SYNCED' = 'notSynced'
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

	@Output() verifiedBadgeAssertion: EventEmitter<PublicApiBadgeAssertion> = new EventEmitter<PublicApiBadgeAssertion>();

	get identityEmail(): string {
		return this.queryParamService.queryStringValue('identity__email');
	}

	get isBadgeVerified() {
		return this.signatureValid && this.issuerBlockchainDataValid && this.credentialBlockchainDataValid 
		&& this.awardedState !== AwardedState.NO_MATCH && this.expiryState !== ExpiryState.EXPIRED 
		&& this.revokedState == RevokedState.NOT_REVOKED;
	}

	badgeAssertion: PublicApiBadgeAssertion | null = null;

	signatureValid: boolean | null = null;

	issuerBlockchainDataValid: boolean | null = null;

	credentialBlockchainDataValid: boolean | null = null;

	signatureErrors?: string[];

	issuerErrors?: string[];

	credentialErrors?: string[];

	revoked: boolean | null = null;

	revocationReason?: string;

	registryRevocationSynced?: boolean;

	registryRevocationError?: string;

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

	async openDialog( badgeAssertion: PublicApiBadgeAssertion ) {
		this.showModal();

		try {
			const entityId = badgeAssertion['id'].split('/').pop();
			const instance: ApiV2Wrapper<PublicApiBadgeAssertion> =
				await this.publicApiService.verifyBadgeAssertion(entityId);

			if (instance){
				this.badgeAssertion = instance.result;
				this.signatureValid = instance.signatureValid;
				this.issuerBlockchainDataValid = instance.issuerBlockchainDataValid;
				this.credentialBlockchainDataValid = instance.credentialBlockchainDataValid;
				this.signatureErrors = instance.signatureErrors
					? instance.signatureErrors
					: [];
				this.issuerErrors = instance.issuerErrors
					? instance.issuerErrors
					: [];
				this.credentialErrors = instance.credentialErrors
					? instance.credentialErrors
					: [];
				this.revoked = instance.revoked;
				this.revocationReason = instance.revocationReason
					? instance.revocationReason
					: null;
				this.registryRevocationSynced = instance.registryRevocationSynced
					? instance.registryRevocationSynced
					: null;
				this.registryRevocationError = instance.registryRevocationError
					? instance.registryRevocationError
					: null;
			}
			else {
				this.messageService.reportAndThrowError("Failed to verify your badge");
			}
		}
		catch(e) {
			this.closeDialog();
			const parsed = JSON.parse(e.message);
			const validationErrors = parsed.validationErrors || [];
			this.messageService.reportAndThrowError(`Failed to verify your badge: ${validationErrors}`, e);
		}

		this.verifyBadgeAssertion();
	}

	private verifyBadgeAssertion(){
		this.verifyRevocation();

		if (this.badgeAssertion.credentialSubject.identifier.identityType === "email") {
			this.verifyEmail();
		}
		this.verifyExpiresOn();
		this.broadcastVerifiedBadgeAssertion();
	}

	private verifyRevocation() {
		if (this.revoked) {
			if (!this.revocationReason) {
				this.revocationReason = "No reason provided";
			}
			if (this.registryRevocationSynced) {
				this.revokedState = RevokedState.REVOKED;
			} else {
				this.revokedState = RevokedState.NOT_SYNCED;
				if (!this.registryRevocationError) {
					this.registryRevocationError = "Unknown error";
				}
			}
		} else {
			this.revokedState = RevokedState.NOT_REVOKED;
		}
	}

	private verifyEmail() {
		if (!this.identityEmail) {
			this.awardedState = AwardedState.NOT_VERIFIED;
		}
		else if (this.badgeAssertion.credentialSubject.identifier.hashed) {
			// hashed is true
			const hashedEmail = 'sha256$'+sha256( `${this.identityEmail}${this.badgeAssertion.credentialSubject.identifier.salt}`);
			this.awardedState = hashedEmail === this.badgeAssertion.credentialSubject.identifier.identityHash
			                    ? AwardedState.MATCH
			                    : AwardedState.NO_MATCH;
		}
		else {
			// hashed is false, identity is in plain text
			this.awardedState = AwardedState.MATCH;
		}
	}

	private verifyExpiresOn() {
		if (!this.badgeAssertion.validUntil) {
			this.expiryState = ExpiryState.NEVER_EXPIRES;
		}
		else {
			this.expiryState = new Date() > new Date(this.badgeAssertion.validUntil)
			                   ? ExpiryState.EXPIRED
			                   : ExpiryState.NOT_EXPIRED;
		}
	}

	private broadcastVerifiedBadgeAssertion() {
		if (this.badgeAssertion){
			this.verifiedBadgeAssertion.emit(this.badgeAssertion);
		}
	}

	private closeDialog() {
		this.closeModal();
	}
}
