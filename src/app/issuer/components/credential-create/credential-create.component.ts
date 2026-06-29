import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { BaseAuthenticatedRoutableComponent } from '../../../common/pages/base-authenticated-routable.component';

import { SessionService } from '../../../common/services/session.service';
import { MessageService } from '../../../common/services/message.service';
import { CommonDialogsService } from '../../../common/services/common-dialogs.service';
import { AppConfigService } from '../../../common/app-config.service';

import { IssuerManager } from '../../services/issuer-manager.service';
import { BadgeInstanceManager } from '../../services/badgeinstance-manager.service';

import { Issuer } from '../../models/issuer.model';
import { LinkEntry } from '../../../common/components/bg-breadcrumbs/bg-breadcrumbs.component';
import { typedFormGroup } from '../../../common/util/typed-forms';

@Component({
    selector: 'credential-create',
    templateUrl: './credential-create.component.html'
})
export class CredentialCreateComponent extends BaseAuthenticatedRoutableComponent implements OnInit {

    issuer: Issuer;
    issuerLoaded: Promise<unknown>;

    breadcrumbLinkEntries: LinkEntry[] = [];

    submitting = false;

    readonly credentialTypes: { [key: string]: string } = {
        academic: "Academic Certificate",
        degree: "Degree Certificate",
        experience: "Experience Certificate"
    };

    constructor(
        protected title: Title,
        protected messageService: MessageService,
        protected issuerManager: IssuerManager,
        protected badgeInstanceManager: BadgeInstanceManager,
        protected dialogService: CommonDialogsService,
        protected configService: AppConfigService,
        sessionService: SessionService,
        router: Router,
        route: ActivatedRoute
    ) {
        super(router, route, sessionService);

        this.title.setTitle(
            `Create Credential - ${this.configService.theme['serviceName'] || 'Badgr'}`
        );

        this.issuerLoaded = this.issuerManager
            .getIssuer()
            .then((issuer) => {

                this.issuer = issuer;

                this.breadcrumbLinkEntries = [
                    {
                        title: 'Issuer',
                        routerLink: ['/issuer']
                    },
                    {
                        title: `University ${issuer.id}`,
                        routerLink: ['/issuer']
                    },
                    {
                        title: 'Create Credential'
                    }
                ];
            });
    }

    ngOnInit() {
        super.ngOnInit();
    }

    credentialForm = typedFormGroup()

        .addControl(
            "credentialType",
            "academic",
            Validators.required
        )

        // Common
        .addControl(
            "userId",
            "",
            Validators.required
        )

        // ------------------------
        // Academic Certificate
        // ------------------------

        .addControl(
            "courseId",
            ""
        )

        .addControl(
            "grade",
            ""
        )

        // ------------------------
        // Degree Certificate
        // ------------------------

        .addControl(
            "name",
            ""
        )

        .addControl(
            "degreeType",
            ""
        )

        // ------------------------
        // Experience Certificate
        // ------------------------

        .addControl(
            "description",
            ""
        );

    get selectedCredentialType(): string {
        return this.credentialForm.controls.credentialType.value;
    }

    get isAcademic(): boolean {
        return this.selectedCredentialType === "academic";
    }

    get isDegree(): boolean {
        return this.selectedCredentialType === "degree";
    }

    get isExperience(): boolean {
        return this.selectedCredentialType === "experience";
    }

    creationCanceled(): void {
        this.router.navigate([
            "/issuer"
        ]);
    }

    onSubmit() {

        if (!this.credentialForm.markTreeDirtyAndValidate()) {
            return;
        }

        this.submitting = true;

        const form = this.credentialForm.value;

        let request: Promise<any>;

        switch (form.credentialType) {

            case "academic":

                request = this.badgeInstanceManager.createAcademicCertificate({
                    userId: form.userId,
                    courseId: form.courseId,
                    grade: Number(form.grade)
                });

                break;

            case "degree":

                request = this.badgeInstanceManager.createDegreeCertificate({
                    userId: form.userId,
                    grade: Number(form.grade),
                    name: form.name,
                    degreeType: form.degreeType
                });

                break;

            case "experience":

                request = this.badgeInstanceManager.createExperienceCertificate({
                    userId: form.userId,
                    description: form.description
                });

                break;

            default:

                this.messageService.setMessage(
                    "Unknown credential type.",
                    "error"
                );

                this.submitting = false;
                return;
        }

        request
            .then(() => {

                this.messageService.setMessage(
                    "Credential created successfully.",
                    "success"
                );

                this.router.navigate([
                    "/issuer"
                ]);

            })
            .catch(error => {
                let message = "Unknown error";

                if (error && error.error && error.error.message) {
                    message = error.error.message;
                } else if (error && error.message) {
                    message = error.message;
                }

                this.messageService.reportAndThrowError(
                    "Unable to create credential: " + message,
                    error
                );

            })
            .finally(() => {

                this.submitting = false;

            });
    }

    trackByIndex(index: number): number {
        return index;
    }

    get showAcademicFields(): boolean {
        return this.selectedCredentialType === "academic";
    }

    get showDegreeFields(): boolean {
        return this.selectedCredentialType === "degree";
    }

    get showExperienceFields(): boolean {
        return this.selectedCredentialType === "experience";
    }
}