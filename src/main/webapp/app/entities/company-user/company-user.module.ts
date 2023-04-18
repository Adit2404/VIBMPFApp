import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyUserComponent } from './list/company-user.component';
import { CompanyUserDetailComponent } from './detail/company-user-detail.component';
import { CompanyUserUpdateComponent } from './update/company-user-update.component';
import { CompanyUserDeleteDialogComponent } from './delete/company-user-delete-dialog.component';
import { CompanyUserRoutingModule } from './route/company-user-routing.module';

@NgModule({
  imports: [SharedModule, CompanyUserRoutingModule],
  declarations: [CompanyUserComponent, CompanyUserDetailComponent, CompanyUserUpdateComponent, CompanyUserDeleteDialogComponent],
})
export class CompanyUserModule {}
