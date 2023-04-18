import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompanyApplicationStatusComponent } from '../list/company-application-status.component';
import { CompanyApplicationStatusDetailComponent } from '../detail/company-application-status-detail.component';
import { CompanyApplicationStatusUpdateComponent } from '../update/company-application-status-update.component';
import { CompanyApplicationStatusRoutingResolveService } from './company-application-status-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const companyApplicationStatusRoute: Routes = [
  {
    path: '',
    component: CompanyApplicationStatusComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyApplicationStatusDetailComponent,
    resolve: {
      companyApplicationStatus: CompanyApplicationStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyApplicationStatusUpdateComponent,
    resolve: {
      companyApplicationStatus: CompanyApplicationStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyApplicationStatusUpdateComponent,
    resolve: {
      companyApplicationStatus: CompanyApplicationStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companyApplicationStatusRoute)],
  exports: [RouterModule],
})
export class CompanyApplicationStatusRoutingModule {}
