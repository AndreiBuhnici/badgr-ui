import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from '@angular/platform-browser';

import { StaffManager } from "../../services/staff-manager.service";
import { CredentialModel } from "../../../common/model/credential-model";
import { BaseAuthenticatedRoutableComponent } from "../../../common/pages/base-authenticated-routable.component";
import { SessionService } from "../../../common/services/session.service";
import { MessageService } from "../../../common/services/message.service";

type CredentialType = "academic" | "degree" | "experience";

@Component({
    selector: "verify-requests",
    templateUrl: "./verify-requests.component.html"
})
export class VerifyRequestsComponent extends BaseAuthenticatedRoutableComponent implements OnInit {

    credentialsLoaded: Promise<any>;

    academicCertificates: CredentialModel[] = [];
    degreeCertificates: CredentialModel[] = [];
    experienceCertificates: CredentialModel[] = [];

    constructor(
        protected title: Title,
        protected sessionService: SessionService,
        protected staffManager: StaffManager,
        protected messageService: MessageService,
        router: Router,
		route: ActivatedRoute
    ) {
        super(router, route, sessionService);
		this.title.setTitle('Verify pending requests');
    }

    ngOnInit() {
        this.loadPending();
    }

    loadPending() {
        this.credentialsLoaded = Promise.all([
            this.staffManager.listPending("academic").then(res => this.academicCertificates = res || []),
            this.staffManager.listPending("degree").then(res => this.degreeCertificates = res || []),
            this.staffManager.listPending("experience").then(res => this.experienceCertificates = res || [])
        ]);
    }

    approve(type: CredentialType, credential: CredentialModel) {
        this.staffManager.approve(type, credential.credentialId).then(() => {
            this.messageService.setMessage(
                "Request approved successfully.",
                "success"
            );
            this.loadPending();
        })
        .catch(err => {
            this.messageService.reportAndThrowError(
                err && err.message ? err.message : "Failed to approve request.",
                "error"
            );
        });
    }

    reject(type: CredentialType, credential: CredentialModel) {
        this.staffManager.reject(type, credential.credentialId).then(() => {
            this.messageService.setMessage(
                "Request rejected successfully.",
                "success"
            );
            this.loadPending();
        })
        .catch(err => {
            this.messageService.reportAndThrowError(
                err && err.message ? err.message : "Failed to reject request.",
                "error"
            );
        });
    }

    get hasVisibleCredentials(): boolean {
        return this.academicCertificates.length > 0 ||
               this.degreeCertificates.length > 0 ||
               this.experienceCertificates.length > 0;
    }
}