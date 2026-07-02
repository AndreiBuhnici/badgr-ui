import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import {RecipientEarnedBadgeDetailComponent} from './components/recipient-earned-badge-detail/recipient-earned-badge-detail.component';
import {RecipientEarnedBadgeListComponent} from './components/recipient-earned-badge-list/recipient-earned-badge-list.component';
import {AddBadgeDialogComponent} from './components/add-badge-dialog/add-badge-dialog.component';
import {RecipientBadgeApiService} from './services/recipient-badges-api.service';
import {RecipientBadgeManager} from './services/recipient-badge-manager.service';
import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
import { MozzTransitionModule } from "../mozz-transition/mozz-transition.module";
import { StudentPermissionGuard } from '../common/guards/student-permission.guard';

const routes = [
	/* Recipient Badges */
	{
    	path: "",
    	redirectTo: "badges",
    	pathMatch: "full",
		canActivate: [StudentPermissionGuard]
	},
	{
		path: "badges",
		component: RecipientEarnedBadgeListComponent,
		canActivate: [StudentPermissionGuard]
	},
	{
		path: "badges/import",
		component: RecipientEarnedBadgeListComponent,
		canActivate: [StudentPermissionGuard]
	},
	{
		path: "earned-badge/:type/:id",
		component: RecipientEarnedBadgeDetailComponent,
		canActivate: [StudentPermissionGuard]
	},
	{
		path: "**",
		redirectTo: 'badges',
		canActivate: [StudentPermissionGuard]
	},
];

@NgModule({
	imports: [
		...COMMON_IMPORTS,
		BadgrCommonModule,
		CommonEntityManagerModule,
		RouterModule.forChild(routes),
		MozzTransitionModule
	],
	declarations: [
		RecipientEarnedBadgeListComponent,
		RecipientEarnedBadgeDetailComponent,
		AddBadgeDialogComponent
	],
	providers: [
		RecipientBadgeApiService,
		RecipientBadgeManager
	],
	exports: []
})
export class RecipientModule {}
