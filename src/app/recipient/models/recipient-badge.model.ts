import {ManagedEntity} from '../../common/model/managed-entity';
import {ApiEntityRef} from '../../common/model/entity-ref';
import {ApiRecipientBadgeClass, ApiRecipientBadgeInstance, RecipientBadgeInstanceRef} from './recipient-badge-api.model';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';
import {LinkedEntitySet} from '../../common/model/linked-entity-set';

type BadgeMostRelevantStatusType = "new" | "expired" | "pending";

export class RecipientBadgeInstance extends ManagedEntity<ApiRecipientBadgeInstance, RecipientBadgeInstanceRef> {

	get type(): string { return this.apiModel.json.type; }
	get recipientEmail(): string { return this.apiModel.recipient_identifier; }
	get badgeClass(): ApiRecipientBadgeClass { return this.apiModel.json.badge; }
	get issueDate(): Date { return this._issueDate ? this._issueDate : (this._issueDate = new Date(this.apiModel.json.validFrom)); }
	get image(): string { return this.apiModel.image; }
	get imagePreview(): string { return this.apiModel.imagePreview.id; }
	get narrative(): string { return this.apiModel.narrative; }
	get evidence_items(): Array<unknown> { return this.apiModel.evidence_items; }

	get expiresDate(): Date { return this._expiresDate ? this._expiresDate : (this._expiresDate = this.apiModel.json.validUntil && new Date(this.apiModel.json.validUntil) || null); }

	get shareUrl(): string { return this.apiModel.shareUrl; }

	get isNew(): boolean { return this.apiModel.acceptance === "Unaccepted"; }

	get isExpired(): boolean { return this.mostRelevantStatus === "expired"; }

	get mostRelevantStatus(): BadgeMostRelevantStatusType | null {
		if (this.expiresDate && this.expiresDate < new Date()) {
			return "expired";
		} else if(this.apiModel.pending) {
			return "pending";
		} else if (this.apiModel.acceptance === "Unaccepted") {
			return "new";
		}
	}

	get issuerId(): string {
		return this.apiModel.json.badge.issuer.id;
	}

	get criteriaUrl(): string {
		return this.badgeClass.criteria_url || this.badgeClass.criteria || null;
	}
	/**
	 * Cached copy of the immutable issueDate for optimization
	 */
	_issueDate: Date;

	/**
	 * Cached copy of the immutable expiresDate for optimization
	 */
	_expiresDate: Date | null = null;

	constructor(
		commonManager: CommonEntityManager,
		initialEntity: ApiRecipientBadgeInstance = null,
		onUpdateSubscribed: () => void = undefined
	) {
		super(commonManager, onUpdateSubscribed);

		if (initialEntity) {
			this.applyApiModel(initialEntity);
		}
	}

	protected buildApiRef(): ApiEntityRef {
		return {
			"@id": String(this.apiModel.id),
			slug: String(this.apiModel.id),
		};
	}


	markAccepted(): Promise<this> {
		if (this.isNew) {
			this.apiModel.acceptance = "Accepted";

			return this.recipientBadgeManager.recipientBadgeApiService
				.saveInstance(this.apiModel)
				.then(newModel => this.applyApiModel(newModel));
		} else {
			return Promise.resolve(this);
		}
	}

	hasExtension(extensionName: string) {
		return (this.apiModel.extensions && extensionName in this.apiModel.extensions);
	}
	getExtension(extensionName: string, defaultValue) {
		return this.hasExtension(extensionName) ? this.apiModel.extensions[extensionName] : defaultValue;
	}
}
