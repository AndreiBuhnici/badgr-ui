import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';
import { SessionService } from '../../../common/services/session.service';
import { MessageService } from '../../../common/services/message.service';
import { RecipientBadgeManager } from '../../services/recipient-badge-manager.service';
import { LinkEntry } from '../../../common/components/bg-breadcrumbs/bg-breadcrumbs.component';
import { BadgeInstance } from '../../../issuer/models/badgeinstance.model';
import { AddBadgeDialogComponent } from '../add-badge-dialog/add-badge-dialog.component';

type BadgeDisplay = "grid" | "list";

@Component({
    selector: 'recipient-earned-badge-list',
    templateUrl: './recipient-earned-badge-list.component.html'
})
export class RecipientEarnedBadgeListComponent
    extends BaseAuthenticatedRoutableComponent
    implements OnInit {

    readonly noBadgesImageUrl =
        require('@concentricsky/badgr-style/dist/images/image-empty-backpack.svg');

    crumbs: LinkEntry[] = [
        {
            title: 'My Credentials',
            routerLink: ['/recipient/badges']
        }
    ];

    @ViewChild('addBadgeDialog')
    addBadgeDialog: AddBadgeDialogComponent;

    badgesLoaded: Promise<unknown>;

    academicCertificates: BadgeInstance[] = [];
    degreeCertificates: BadgeInstance[] = [];
    experienceCertificates: BadgeInstance[] = [];

    filteredAcademicCertificates: BadgeInstance[] = [];
    filteredDegreeCertificates: BadgeInstance[] = [];
    filteredExperienceCertificates: BadgeInstance[] = [];

    private _searchQuery = "";

    private _badgesDisplay: BadgeDisplay = "grid";

    get badgesDisplay(): BadgeDisplay {
        return this._badgesDisplay;
    }

    set badgesDisplay(value: BadgeDisplay) {
        this._badgesDisplay = value;
        this.saveDisplayState();
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        this._searchQuery = value;
        this.saveDisplayState();
        this.updateResults();
    }

    openAddBadgeDialog() {
        this.addBadgeDialog
            .openDialog()
            .then(() => this.reloadCredentials())
            .catch(() => {});
    }

    constructor(
        router: Router,
        route: ActivatedRoute,
        sessionService: SessionService,
        private title: Title,
        private messageService: MessageService,
        private recipientBadgeManager: RecipientBadgeManager
    ) {
        super(router, route, sessionService);

        this.title.setTitle(`My Credentials`);

        this.restoreDisplayState();

        this.badgesLoaded = this.reloadCredentials()
            .catch(error =>
                this.messageService.reportAndThrowError(
                    "Failed to load credentials.",
                    error
                )
            );
    }

    ngOnInit() {
        super.ngOnInit();
    }

    private reloadCredentials(): Promise<void> {
        return Promise.all([
            this.recipientBadgeManager.listAcademicCertificates(),
            this.recipientBadgeManager.listDegreeCertificates(),
            this.recipientBadgeManager.listExperienceCertificates()
        ])
        .then(([academic, degree, experience]) => {

            this.academicCertificates = academic || [];
            this.degreeCertificates = degree || [];
            this.experienceCertificates = experience || [];

            this.updateResults();

            console.log(this.filteredAcademicCertificates);
        });
    }

    private updateResults(): void {

        const query = this.searchQuery
            .trim()
            .toLowerCase();

        const matches = (credential: BadgeInstance) => {

            if (!query) {
                return true;
            }

            return (
                (credential.achievementName || "")
                    .toLowerCase()
                    .includes(query)
                ||
                (credential.achievementDescription || "")
                    .toLowerCase()
                    .includes(query)
                ||
                (credential.achievementType || "")
                    .toLowerCase()
                    .includes(query)
            );

        };

        this.filteredAcademicCertificates =
            this.academicCertificates.filter(matches);

        this.filteredDegreeCertificates =
            this.degreeCertificates.filter(matches);

        this.filteredExperienceCertificates =
            this.experienceCertificates.filter(matches);

    }

    restoreDisplayState() {
        try {
            const state = JSON.parse(
                localStorage["recipient-earned-badge-list-viewstate"]
            );
            this.searchQuery = state.searchQuery || "";
            if (state.badgesDisplay) {
                this.badgesDisplay = state.badgesDisplay;
            }
        } catch {}
    }

    saveDisplayState() {
        try {
            localStorage["recipient-earned-badge-list-viewstate"] =
                JSON.stringify({
                    searchQuery: this.searchQuery,
                    badgesDisplay: this.badgesDisplay
                });
        } catch {}
    }

    hasCredentials(): boolean {
        return (
            this.academicCertificates.length > 0 ||
            this.degreeCertificates.length > 0 ||
            this.experienceCertificates.length > 0
        );
    }
}