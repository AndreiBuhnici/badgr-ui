import {Injectable} from '@angular/core';
import {BaseHttpApiService} from '../../common/services/base-http-api.service';
import {SessionService} from '../../common/services/session.service';
import {AppConfigService} from '../../common/app-config.service';
import {MessageService} from '../../common/services/message.service';
import {HttpClient} from '@angular/common/http';
import {ApiApprovalBadgeInstance} from '../models/credentials-api.model';

interface ApiResponse<T> {
    status: {
        success: boolean;
        description: string;
    };
    result: T;
}

@Injectable()
export class ApproverApiService extends BaseHttpApiService {
	constructor(
		protected loginService: SessionService,
		protected http: HttpClient,
		protected configService: AppConfigService,
		protected messageService: MessageService
	) {
		super(loginService, http, configService, messageService);
	}

	listBadgeInstanceApprovals() {
		return this.get<ApiResponse<ApiApprovalBadgeInstance[]>>(`/v2/approver/badgeinstances`).then(r => r.body.result);
	}

	approveBadgeInstance(entityId: string) {
		return this.post(
			`/v2/approver/badgeinstances/approve/${entityId}`,
			{}
		);
	}

	rejectBadgeInstance(entityId: string) {
		return this.post(
			`/v2/approver/badgeinstances/reject/${entityId}`,
			{}
		);
	}
}
