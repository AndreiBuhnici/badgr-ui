import { Component, OnInit, ViewChild } from '@angular/core';
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
import  {BadgeStudioComponent } from '../badge-studio/badge-studio.component';
import { BgFormFieldImageComponent } from '../../../common/components/formfield-image';

import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UrlValidator } from '../../../common/validators/url.validator';

@Component({
    selector: 'credential-create',
    templateUrl: './credential-create.component.html'
})
export class CredentialCreateComponent extends BaseAuthenticatedRoutableComponent implements OnInit {

    issuer: Issuer;
    issuerLoaded: Promise<unknown>;

    breadcrumbLinkEntries: LinkEntry[] = [];

    submitting = false;

    @ViewChild('badgeStudio')
    badgeStudio: BadgeStudioComponent;

    @ViewChild('imageField')
	imageField: BgFormFieldImageComponent;

    @ViewChild('newTagInput')
    newTagInput: ElementRef<HTMLInputElement>;

    tags = new Set<string>();

    showAdvanced: boolean[] = [false];

    credentialTypes: { [key: string]: string } = {};

    constructor(
        protected title: Title,
        protected messageService: MessageService,
        protected issuerManager: IssuerManager,
        protected badgeInstanceManager: BadgeInstanceManager,
        protected dialogService: CommonDialogsService,
        protected configService: AppConfigService,
        protected fb: FormBuilder,
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

                if (this.isAdmin) {
                    this.credentialTypes = {
                        academic: "Academic Certificate",
                        degree: "Degree Certificate",
                        experience: "Experience Certificate"
                    };
                } else if (this.isIssuer) {
                    this.credentialTypes = {
                        academic: "Academic Certificate",
                        degree: "Degree Certificate"
                    };

                    this.credentialForm.controls.credentialType.setValue("academic");
                } else if (this.isEmployer) {
                    this.credentialTypes = {
                        experience: "Experience Certificate"
                    };

                    this.credentialForm.controls.credentialType.setValue("experience");
                }
            });
    }

    ngOnInit() {
        super.ngOnInit();
    }

    addTag() {
        const newTag = ((this.newTagInput.nativeElement as HTMLInputElement).value || '')
            .trim()
            .toLowerCase();

        if (newTag.length > 0) {
            this.tags.add(newTag);
            this.newTagInput.nativeElement.value = '';
        }
    }

    handleTagInputKeyPress(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.addTag();
            this.newTagInput.nativeElement.focus();
            event.preventDefault();
        }
    }

    removeTag(tag: string) {
        this.tags.delete(tag);
    }

    addAlignment() {
        this.credentialForm.controls.alignment.addFromTemplate();
    }

    removeAlignment(
        alignment: this['credentialForm']['controls']['alignment']['controls'][0]
    ) {
        this.credentialForm.controls.alignment.removeAt(
            this.credentialForm.controls.alignment.controls.indexOf(alignment)
        );
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
        )

        // ------------------------
        // Optional Achievement Metadata
        // ------------------------

        .addControl(
            "criteriaText",
            ""
        )

        .addControl(
            "criteriaUrl",
            ""
        )

        .addArray(
            "alignment",
            typedFormGroup()
                .addControl("target_name", "", Validators.required)
                .addControl("target_url", "", [Validators.required, UrlValidator.validUrl])
                .addControl("target_description", "")
                .addControl("target_framework", "")
                .addControl("target_code", "")
                .addControl("target_type", "")
        )

        .addControl(
            "validUntil",
            null
        )

        .addControl(
            "image",
            null
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

    
    generateRandomImage() {
        this.badgeStudio.generateRandom().then(imageUrl => this.imageField.useDataUrl(imageUrl, "Auto-generated image"));
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
                    grade: Number(form.grade),
                    criteria: {
                        narrative: form.criteriaText,
                        id: form.criteriaUrl
                    },
                    alignment: form.alignment,
                    tag: Array.from(this.tags),
                    validUntil: form.validUntil
                        ? new Date(form.validUntil).toISOString()
                        : null,
                    image: form.image
                });

                break;

            case "degree":

                request = this.badgeInstanceManager.createDegreeCertificate({
                    userId: form.userId,
                    grade: Number(form.grade),
                    name: form.name,
                    degreeType: form.degreeType,
                    criteria: {
                        narrative: form.criteriaText,
                        id: form.criteriaUrl
                    },
                    alignment: form.alignment,
                    tag: Array.from(this.tags),
                    validUntil: form.validUntil
                        ? new Date(form.validUntil).toISOString()
                        : null,
                    image: form.image
                });

                break;

            case "experience":

                request = this.badgeInstanceManager.createExperienceCertificate({
                    userId: form.userId,
                    description: form.description,
                    criteria: {
                        narrative: form.criteriaText,
                        id: form.criteriaUrl
                    },
                    alignment: form.alignment,
                    tag: Array.from(this.tags),
                    validUntil: form.validUntil
                        ? new Date(form.validUntil).toISOString()
                        : null,
                    image: form.image
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