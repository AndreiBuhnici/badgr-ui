import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';

import {PublicComponent} from './components/public/public.component';
import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
import {PublicCredentialComponent} from './components/credential/credential.component';
import {PublicApiService} from './services/public-api.service';
import {BadgrRouteData} from '../common/services/navigation.service';
import {VerifyBadgeDialog} from './components/verify-badge-dialog/verify-badge-dialog.component';

export const routes: Routes = [
	{
		path: '',
		component: PublicComponent,
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData
	},

	{
		path: 'credentials/:typeId/:credentialId',
		component: PublicCredentialComponent,
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData
	},

	{
		path: '**',
		component: PublicComponent,
		data: {
			publiclyAccessible: true,
		} as BadgrRouteData
	},
];

@NgModule({
	imports: [
		...COMMON_IMPORTS,
		BadgrCommonModule,
		CommonEntityManagerModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		PublicComponent,
		PublicCredentialComponent,
		VerifyBadgeDialog
	],
	exports: [],
	providers: [
		PublicApiService
	]
})
export class PublicModule {
}
