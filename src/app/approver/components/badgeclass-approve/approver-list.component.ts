import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../../common/services/session.service';
import {BaseAuthenticatedRoutableComponent} from '../../../common/pages/base-authenticated-routable.component';
import {MessageService} from '../../../common/services/message.service';
import {ApproverApiService} from '../../services/approver-api.service';
import {ApiApprovalBadgeInstance} from '../../models/credentials-api.model';

@Component({
	selector: 'approver-list',
	templateUrl: './approver-list.component.html',
})
export class ApproverListComponent extends BaseAuthenticatedRoutableComponent implements OnInit {
	loading = false;
    approvals: ApiApprovalBadgeInstance[] = [];
    processingEntityId: string = null;

	constructor(
		protected approverApi: ApproverApiService,
		protected messageService: MessageService,
		loginService: SessionService,
		router: Router,
		route: ActivatedRoute
	) {
		super(router, route, loginService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.loadApprovals();
	}

	loadApprovals() {
        this.loading = true;

        this.approverApi
            .listBadgeInstanceApprovals()
            .then(results => {
                console.log('Approvals:', results);
                this.approvals = results;
            })
            .finally(() => {
                this.loading = false;
            });
    }

    approve(instance: ApiApprovalBadgeInstance) {
        this.processingEntityId = instance.entityId;

        this.approverApi
            .approveBadgeInstance(instance.entityId)
            .then(() => {
                this.approvals = this.approvals.filter(
                    x => x.entityId !== instance.entityId
                );
            })
            .catch(err => {
                let validationMessage = 'Unknown error';

                if (
                    err &&
                    err.response &&
                    err.response.error &&
                    err.response.error.validationErrors &&
                    err.response.error.validationErrors.length
                ) {
                    validationMessage =
                        err.response.error.validationErrors[0];
                }

                this.messageService.reportAndThrowError(
                    'Failed to approve credential: ' + validationMessage
                );
            })
            .finally(() => {
                this.processingEntityId = null;
            });
    }

    reject(instance: ApiApprovalBadgeInstance) {
        this.processingEntityId = instance.entityId;

        this.approverApi
            .rejectBadgeInstance(instance.entityId)
            .then(() => {
                this.approvals = this.approvals.filter(
                    x => x.entityId !== instance.entityId
                );
            })
            .catch(err => {
                let validationMessage = 'Unknown error';

                if (
                    err &&
                    err.response &&
                    err.response.error &&
                    err.response.error.validationErrors &&
                    err.response.error.validationErrors.length
                ) {
                    validationMessage =
                        err.response.error.validationErrors[0];
                }

                this.messageService.reportAndThrowError(
                    'Failed to approve credential: ' + validationMessage
                );
            })
            .finally(() => {
                this.processingEntityId = null;
            });
    }
}
