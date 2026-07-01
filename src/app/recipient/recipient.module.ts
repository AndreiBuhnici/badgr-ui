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

const routes = [
	/* Recipient Badges */
	{
		path: "",
		redirectTo: 'badges',
	},
	{
		path: "badges",
		component: RecipientEarnedBadgeListComponent
	},
	{
		path: "badges/import",
		component: RecipientEarnedBadgeListComponent

	},
	{
		path: "earned-badge/:type/:id",
		component: RecipientEarnedBadgeDetailComponent
	},
	{
		path: "**",
		redirectTo: 'badges',
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
