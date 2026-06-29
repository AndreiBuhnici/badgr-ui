import {ApiIssuer, IssuerRef, IssuerUrl} from './issuer-api.model';
import {ManagedEntity} from '../../common/model/managed-entity';
import {ApiEntityRef} from '../../common/model/entity-ref';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';
import {EmbeddedEntitySet} from '../../common/model/managed-entity-set';


export class Issuer extends ManagedEntity<ApiIssuer, IssuerRef> {
	protected buildApiRef(): ApiEntityRef {
		return {
			"@id": this.issuerDid,
			slug: this.apiModel.id,
		};
	}

	constructor(
		commonManager: CommonEntityManager,
		initialEntity: ApiIssuer = null,
		onUpdateSubscribed: () => void = undefined
	) {
		super(commonManager, onUpdateSubscribed);

		if (initialEntity != null) {
			this.applyApiModel(initialEntity);
		}
	}

	get issuerDid(): IssuerUrl { return this.apiModel.did; }

	get id(): string { return this.apiModel.id; }

	private get issuerApiService() {
		return this.commonManager.issuerManager.issuerApiService;
	}
}
