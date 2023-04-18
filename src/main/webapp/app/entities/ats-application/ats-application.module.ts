import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AtsApplicationComponent } from './list/ats-application.component';
import { AtsApplicationDetailComponent } from './detail/ats-application-detail.component';
import { AtsApplicationUpdateComponent } from './update/ats-application-update.component';
import { AtsApplicationDeleteDialogComponent } from './delete/ats-application-delete-dialog.component';
import { AtsApplicationRoutingModule } from './route/ats-application-routing.module';

@NgModule({
  imports: [SharedModule, AtsApplicationRoutingModule],
  declarations: [
    AtsApplicationComponent,
    AtsApplicationDetailComponent,
    AtsApplicationUpdateComponent,
    AtsApplicationDeleteDialogComponent,
  ],
})
export class AtsApplicationModule {}
