import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AtsApplicationComponent } from '../list/ats-application.component';
import { AtsApplicationDetailComponent } from '../detail/ats-application-detail.component';
import { AtsApplicationUpdateComponent } from '../update/ats-application-update.component';
import { AtsApplicationRoutingResolveService } from './ats-application-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const atsApplicationRoute: Routes = [
  {
    path: '',
    component: AtsApplicationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AtsApplicationDetailComponent,
    resolve: {
      atsApplication: AtsApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AtsApplicationUpdateComponent,
    resolve: {
      atsApplication: AtsApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AtsApplicationUpdateComponent,
    resolve: {
      atsApplication: AtsApplicationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(atsApplicationRoute)],
  exports: [RouterModule],
})
export class AtsApplicationRoutingModule {}
