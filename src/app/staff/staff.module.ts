import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import { RegisterStaffComponent } from './components/register-staff/register-staff.component';
import { AdminPermissionGuard } from '../common/guards/admin-permission.guard';
import { VerifierPermissionGuard } from '../common/guards/verifier-permission.guard';
import { StaffManager } from './services/staff-manager.service';
import { StaffApiService } from './services/staff-api.service';
import { VerifyRequestsComponent } from './components/verify-requests/verify-requests.component';

const routes = [
	{
		path: "register",
		component: RegisterStaffComponent,
		canActivate: [AdminPermissionGuard]
	},
	{
		path: "verifyRequests",
		component: VerifyRequestsComponent,
		canActivate: [VerifierPermissionGuard]
	},
];

@NgModule({
	imports: [
		...COMMON_IMPORTS,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		BadgrCommonModule,
	  RouterModule.forChild(routes)
	],
	declarations: [
		RegisterStaffComponent,
		VerifyRequestsComponent
	],
	exports: [],
	providers: [
		StaffManager,
		StaffApiService
	]
})
export class StaffModule {}
