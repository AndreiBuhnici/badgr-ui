import { BadgeInstanceRef } from './badgeinstance-api.model';
import { ManagedEntity } from '../../common/model/managed-entity';
import { ApiEntityRef } from '../../common/model/entity-ref';
import { CommonEntityManager } from '../../entity-manager/services/common-entity-manager.service';
import { CredentialModel } from '../../common/model/credential-model';

export class BadgeInstance extends ManagedEntity<CredentialModel, BadgeInstanceRef> {

    constructor(
        commonManager: CommonEntityManager,
        initialEntity: CredentialModel = null
    ) {
        super(commonManager);

        if (initialEntity) {
            this.applyApiModel(initialEntity);
        }
    }

    protected buildApiRef(): ApiEntityRef {
        return {
            "@id": this.credentialId,
            slug: this.credentialId
        };
    }

    get credentialId(): string {
        return this.apiModel.credentialId;
    }

    get achievementId(): string {
        return this.apiModel.achievementId;
    }

    get achievementType(): string {
        return this.apiModel.achievementType;
    }

    get achievementName(): string {
        return this.apiModel.achievementName;
    }

    get achievementDescription(): string {
        return this.apiModel.achievementDescription;
    }

    get achievementImage(): string {
        return this.apiModel.achievementImage;
    }

    get achievementCriteria(): any {
        return this.apiModel.achievementCriteria;
    }

    get achievementAlignment(): any[] {
        return this.apiModel.achievementAlignment;
    }

    get achievementTag(): any[] {
        return this.apiModel.achievementTag;
    }

    get recipientId(): string {
        return this.apiModel.recipientId;
    }

    get issuerDid(): string {
        return this.apiModel.issuerDid;
    }

    get issuerName(): string {
        return this.apiModel.issuerName;
    }

    get universityId(): string {
        return this.apiModel.universityId;
    }

    get revocationListId(): string {
        return this.apiModel.revocationListId;
    }

    get revocationListIndex(): number {
        return this.apiModel.revocationListIndex;
    }

    get validFrom(): Date {
        return new Date(this.apiModel.validFrom);
    }

    get validUntil(): Date | undefined {
        return this.apiModel.validUntil
            ? new Date(this.apiModel.validUntil)
            : undefined;
    }

    get isExpired(): boolean {
        return !!this.validUntil && this.validUntil < new Date();
    }

    get signature(): any {
        return this.apiModel.signature;
    }

    get isSigned(): boolean {
        return !!this.apiModel.signature;
    }
}
