import {NgModule} from '@angular/core';
// import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {BadgrCommonModule, COMMON_IMPORTS} from '../common/badgr-common.module';
import {ApproverListComponent} from './components/badgeclass-approve/approver-list.component'
import {CommonEntityManagerModule} from '../entity-manager/entity-manager.module';
import { ApproverApiService } from './services/approver-api.service';


const routes = [
    /* Approver */
    {
        path: "",
        component: ApproverListComponent
    },

    {
        path: "**",
        component: ApproverListComponent
    }
];

@NgModule({
    imports: [
        ...COMMON_IMPORTS,
        BadgrCommonModule,
        CommonEntityManagerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ApproverListComponent
    ],
    exports: [],
    providers: [
        ApproverApiService
    ]
})
export class ApproverModule {}
