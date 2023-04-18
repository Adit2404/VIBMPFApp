import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AtsUserComponent } from './list/ats-user.component';
import { AtsUserDetailComponent } from './detail/ats-user-detail.component';
import { AtsUserUpdateComponent } from './update/ats-user-update.component';
import { AtsUserDeleteDialogComponent } from './delete/ats-user-delete-dialog.component';
import { AtsUserRoutingModule } from './route/ats-user-routing.module';

@NgModule({
  imports: [SharedModule, AtsUserRoutingModule],
  declarations: [AtsUserComponent, AtsUserDetailComponent, AtsUserUpdateComponent, AtsUserDeleteDialogComponent],
})
export class AtsUserModule {}
