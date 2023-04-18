import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VacancyComponent } from '../list/vacancy.component';
import { VacancyDetailComponent } from '../detail/vacancy-detail.component';
import { VacancyUpdateComponent } from '../update/vacancy-update.component';
import { VacancyRoutingResolveService } from './vacancy-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const vacancyRoute: Routes = [
  {
    path: '',
    component: VacancyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VacancyDetailComponent,
    resolve: {
      vacancy: VacancyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VacancyUpdateComponent,
    resolve: {
      vacancy: VacancyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VacancyUpdateComponent,
    resolve: {
      vacancy: VacancyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vacancyRoute)],
  exports: [RouterModule],
})
export class VacancyRoutingModule {}
