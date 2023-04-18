import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VacancyComponent } from './list/vacancy.component';
import { VacancyDetailComponent } from './detail/vacancy-detail.component';
import { VacancyUpdateComponent } from './update/vacancy-update.component';
import { VacancyDeleteDialogComponent } from './delete/vacancy-delete-dialog.component';
import { VacancyRoutingModule } from './route/vacancy-routing.module';

@NgModule({
  imports: [SharedModule, VacancyRoutingModule],
  declarations: [VacancyComponent, VacancyDetailComponent, VacancyUpdateComponent, VacancyDeleteDialogComponent],
})
export class VacancyModule {}
