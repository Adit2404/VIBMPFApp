import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompanyUserComponent } from '../list/company-user.component';
import { CompanyUserDetailComponent } from '../detail/company-user-detail.component';
import { CompanyUserUpdateComponent } from '../update/company-user-update.component';
import { CompanyUserRoutingResolveService } from './company-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const companyUserRoute: Routes = [
  {
    path: '',
    component: CompanyUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyUserDetailComponent,
    resolve: {
      companyUser: CompanyUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyUserUpdateComponent,
    resolve: {
      companyUser: CompanyUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyUserUpdateComponent,
    resolve: {
      companyUser: CompanyUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companyUserRoute)],
  exports: [RouterModule],
})
export class CompanyUserRoutingModule {}
