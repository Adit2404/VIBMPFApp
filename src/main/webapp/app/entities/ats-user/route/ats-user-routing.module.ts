import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AtsUserComponent } from '../list/ats-user.component';
import { AtsUserDetailComponent } from '../detail/ats-user-detail.component';
import { AtsUserUpdateComponent } from '../update/ats-user-update.component';
import { AtsUserRoutingResolveService } from './ats-user-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const atsUserRoute: Routes = [
  {
    path: '',
    component: AtsUserComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AtsUserDetailComponent,
    resolve: {
      atsUser: AtsUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AtsUserUpdateComponent,
    resolve: {
      atsUser: AtsUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AtsUserUpdateComponent,
    resolve: {
      atsUser: AtsUserRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(atsUserRoute)],
  exports: [RouterModule],
})
export class AtsUserRoutingModule {}
