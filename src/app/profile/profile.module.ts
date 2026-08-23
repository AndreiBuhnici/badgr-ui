import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import {ProfileComponent} from './components/profile/profile.component';
import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
import {ProfileEditComponent} from './components/profile-edit/profile-edit.component';
import {UserProfileManager} from '../common/services/user-profile-manager.service';
import {UserProfileApiService} from '../common/services/user-profile-api.service';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import { MozzTransitionModule } from "../mozz-transition/mozz-transition.module";

const routes = [
	/* Profile */
	{
		path: "",
		redirectTo: "profile",
		pathMatch: 'full',
	},
	{
		path: "profile",
		component: ProfileComponent
	},
	{
		path: "edit",
		component: ProfileEditComponent
	},
	{
		path: "change-password",
		component: ChangePasswordComponent
	},
	{
		path: "**",
		component: ProfileComponent
	},
];

@NgModule({
	imports: [
		...COMMON_IMPORTS,
		BadgrCommonModule,
		CommonEntityManagerModule,
		RouterModule.forChild(routes),
		MozzTransitionModule,
	],
	declarations: [
		ProfileComponent,
		ProfileEditComponent,
		ChangePasswordComponent
	],
	providers: [
		// UserProfileService,
		UserProfileApiService,
		UserProfileManager,
	],
	exports: []
})
export class ProfileModule {}
