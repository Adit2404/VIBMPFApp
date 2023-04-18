import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RemarkComponent } from '../list/remark.component';
import { RemarkDetailComponent } from '../detail/remark-detail.component';
import { RemarkUpdateComponent } from '../update/remark-update.component';
import { RemarkRoutingResolveService } from './remark-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const remarkRoute: Routes = [
  {
    path: '',
    component: RemarkComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RemarkDetailComponent,
    resolve: {
      remark: RemarkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RemarkUpdateComponent,
    resolve: {
      remark: RemarkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RemarkUpdateComponent,
    resolve: {
      remark: RemarkRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(remarkRoute)],
  exports: [RouterModule],
})
export class RemarkRoutingModule {}
