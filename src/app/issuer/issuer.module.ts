import {NgModule} from '@angular/core';
// import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import {IssuerDetailComponent} from './components/issuer-detail/issuer-detail.component';

import {BadgeInstanceManager} from './services/badgeinstance-manager.service';
import {BadgeInstanceApiService} from './services/badgeinstance-api.service';
import {IssuerManager} from './services/issuer-manager.service';
import {IssuerApiService} from './services/issuer-api.service';
import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
import { CredentialCreateComponent } from './components/credential-create/credential-create.component';
import { BadgeStudioComponent } from './components/badge-studio/badge-studio.component';
import { IssuerPermissionGuard } from '../common/guards/issuer-permission.guard';

const routes = [
	/* Issuer */
	{
		path: "",
		component: IssuerDetailComponent,
		pathMatch: "full",
		canActivate: [IssuerPermissionGuard]
	},
	{
		path: "credentials/create",
		component: CredentialCreateComponent,
		canActivate: [IssuerPermissionGuard]
	},
	{
		path: "**",
		component: IssuerDetailComponent,
		canActivate: [IssuerPermissionGuard]
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
		IssuerDetailComponent,
		CredentialCreateComponent,
		BadgeStudioComponent
	],
	exports: [],
	providers: [
		BadgeInstanceApiService,
		BadgeInstanceManager,
		IssuerApiService,
		IssuerManager,
	]
})
export class IssuerModule {}
