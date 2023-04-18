import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAtsUser } from '../ats-user.model';
import { AtsUserService } from '../service/ats-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ats-user-delete-dialog.component.html',
})
export class AtsUserDeleteDialogComponent {
  atsUser?: IAtsUser;

  constructor(protected atsUserService: AtsUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.atsUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
