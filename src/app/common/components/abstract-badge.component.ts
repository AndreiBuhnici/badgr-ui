import {Input, OnChanges, SimpleChange} from '@angular/core';
import {BadgeClass} from '../../issuer/models/badgeclass.model';
import {MessageService} from '../services/message.service';
import {IssuerUrl} from '../../issuer/models/issuer-api.model';
import {BadgeClassRef, BadgeClassSlug, BadgeClassUrl} from '../../issuer/models/badgeclass-api.model';
import {UpdatableSubject} from '../util/updatable-subject';
import {Observable, Subject} from 'rxjs';

export interface BadgeLookupData {
	badge?: BadgeClass;
	issuerId?: IssuerUrl;
	badgeSlug?: BadgeClassSlug;
	badgeId?: BadgeClassUrl | BadgeClassRef;
}

export class AbstractBadgeComponent implements OnChanges, BadgeLookupData {
	@Input()
	badge: BadgeClass;

	@Input()
	issuerId: IssuerUrl;

	@Input()
	badgeSlug: BadgeClassSlug;

	@Input()
	badgeId: BadgeClassRef | BadgeClassUrl;

	private inputBadge: BadgeClass;

	private _loading = true;
	get loading() { return this._loading && !this.forceFailed; }

	private _failed = false;
	get failed() { return this._failed || this.forceFailed; }

	@Input()
	private forceFailed = false;

	private badgeLoadingSubject = new Subject<BadgeLookupData>();

	get badgeIdDescription() {
		if (this.inputBadge || this.inputBadge === null) return `(inputBadge.badgeUrl: ${this.inputBadge && this.inputBadge.badgeUrl})`;
		else if (this.issuerId && this.badgeSlug) return `(issuerId: ${this.issuerId}, badgeSlug: ${this.badgeSlug})`;
		else return `(badgeId: ${this.badgeId})`;
	}

	get badgeLoading$(): Observable<BadgeLookupData> { return this.badgeLoadingSubject.asObservable(); }

	private badgeLoadedSubject = new UpdatableSubject<BadgeClass>();

	get badgeLoaded$(): Observable<BadgeClass> { return this.badgeLoadedSubject.asObservable(); }

	constructor(
		protected messageService: MessageService
	) {}

	ngOnChanges(changes: {[key: string]: SimpleChange }) {
		if ("badge" in changes) {
			this.inputBadge = this.badge;
			this.badge = null;
		}
	}

	private fail(
		message: string,
		error: unknown
	) {
		this.messageService.reportHandledError(message, error);
		this._loading = false;
		this._failed = true;
		this.badgeLoadedSubject.error(error);
	}

	private success(
		badge: BadgeClass
	) {
		this.badge = badge;
		this.badgeLoadedSubject.safeNext(badge);

		this._loading = false;
	}
}
