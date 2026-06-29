import {forwardRef, Inject, Injectable} from '@angular/core';
import {IssuerApiService} from './issuer-api.service';
import {Issuer} from '../models/issuer.model';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';

@Injectable()
export class IssuerManager {
	constructor(
		public issuerApiService: IssuerApiService,
		@Inject(forwardRef(() => CommonEntityManager))
		public commonEntityManager: CommonEntityManager
	) { }

	getIssuer(): Promise<Issuer> {
    return this.issuerApiService.getIssuer().then(apiIssuer => {
        return new Issuer(
            this.commonEntityManager,
            apiIssuer
        );
    });
}
	private throwError(message: string): never {
		throw new Error(message);
	}
}
