import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RemarkComponent } from './list/remark.component';
import { RemarkDetailComponent } from './detail/remark-detail.component';
import { RemarkUpdateComponent } from './update/remark-update.component';
import { RemarkDeleteDialogComponent } from './delete/remark-delete-dialog.component';
import { RemarkRoutingModule } from './route/remark-routing.module';

@NgModule({
  imports: [SharedModule, RemarkRoutingModule],
  declarations: [RemarkComponent, RemarkDetailComponent, RemarkUpdateComponent, RemarkDeleteDialogComponent],
})
export class RemarkModule {}
