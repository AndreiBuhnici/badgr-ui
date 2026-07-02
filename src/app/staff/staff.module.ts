import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import { StaffService } from './services/staff.service';
import { RegisterStaffComponent } from './components/registerStaff/registerStaff.component';
import { StaffPermissionGuard } from '../common/guards/staff-permission.guard';

const routes = [
	{
		path: "register",
		component: RegisterStaffComponent,
		canActivate: [StaffPermissionGuard]
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
		RegisterStaffComponent
	],
	exports: [],
	providers: [
		StaffService
	]
})
export class StaffModule {}
