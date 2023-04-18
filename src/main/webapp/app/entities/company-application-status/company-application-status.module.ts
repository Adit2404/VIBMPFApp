import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyApplicationStatusComponent } from './list/company-application-status.component';
import { CompanyApplicationStatusDetailComponent } from './detail/company-application-status-detail.component';
import { CompanyApplicationStatusUpdateComponent } from './update/company-application-status-update.component';
import { CompanyApplicationStatusDeleteDialogComponent } from './delete/company-application-status-delete-dialog.component';
import { CompanyApplicationStatusRoutingModule } from './route/company-application-status-routing.module';

@NgModule({
  imports: [SharedModule, CompanyApplicationStatusRoutingModule],
  declarations: [
    CompanyApplicationStatusComponent,
    CompanyApplicationStatusDetailComponent,
    CompanyApplicationStatusUpdateComponent,
    CompanyApplicationStatusDeleteDialogComponent,
  ],
})
export class CompanyApplicationStatusModule {}
