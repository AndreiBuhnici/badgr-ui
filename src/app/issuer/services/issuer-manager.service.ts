import {forwardRef, Inject, Injectable} from '@angular/core';
import {IssuerApiService} from './issuer-api.service';
import {Issuer} from '../models/issuer.model';
import {ApiIssuer, ApiIssuerForCreation, ApiIssuerForEditing, IssuerSlug} from '../models/issuer-api.model';
import {Observable} from 'rxjs';
import {StandaloneEntitySet} from '../../common/model/managed-entity-set';
import {CommonEntityManager} from '../../entity-manager/services/common-entity-manager.service';
import {first, map} from 'rxjs/operators';

@Injectable()
export class IssuerManager {
	issuersListCurrentUser = new StandaloneEntitySet<Issuer, ApiIssuer>(
		apiModel => new Issuer(this.commonEntityManager),
		apiModel => apiModel.json.id,
		() => this.issuerApiService.listIssuers()
	);

	issuersList = new StandaloneEntitySet<Issuer, ApiIssuer>(
		apiModel => new Issuer(this.commonEntityManager),
		apiModel => apiModel.json.id,
		() => this.issuerApiService.listAllIssuers()
	);

	constructor(
		public issuerApiService: IssuerApiService,
		@Inject(forwardRef(() => CommonEntityManager))
		public commonEntityManager: CommonEntityManager
	) { }

	createIssuer(
		initialIssuer: ApiIssuerForCreation
	): Promise<Issuer> {
		return this.issuerApiService.createIssuer(initialIssuer)
			.then(newIssuer => this.issuersListCurrentUser.addOrUpdate(newIssuer));
	}

	get allIssuersOfCurrentUser$(): Observable<Issuer[]> {
		return this.issuersListCurrentUser.loaded$.pipe(map(l => l.entities));
	}

	get allIssuers$(): Observable<Issuer[]> {
		return this.issuersList.loaded$.pipe(map(l => l.entities));
	}

	editIssuer(
		issuerSlug: IssuerSlug,
		initialIssuer: ApiIssuerForEditing
	): Promise<Issuer> {
		return this.issuerApiService.editIssuer(issuerSlug, initialIssuer)
			.then(newIssuer => this.issuersListCurrentUser.addOrUpdate(newIssuer));
	}

	deleteIssuer(
		issuerSlug: IssuerSlug,
		issuerToDelete: Issuer
	): Promise<boolean> {
		return this.issuerApiService.deleteIssuer(issuerSlug)
			.then(response => this.issuersListCurrentUser.remove(issuerToDelete));
	}

	issuerBySlug(issuerSlug: IssuerSlug): Promise<Issuer> {
		return this.allIssuersOfCurrentUser$
			.pipe(first())
			.toPromise()
			.then(issuers =>
				issuers.find(i => i.slug === issuerSlug)
				|| this.throwError(`Issuer Slug '${issuerSlug}' not found`)
			);
	}

	private throwError(message: string): never {
		throw new Error(message);
	}
}
