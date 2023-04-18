import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAtsApplication } from '../ats-application.model';
import { AtsApplicationService } from '../service/ats-application.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ats-application-delete-dialog.component.html',
})
export class AtsApplicationDeleteDialogComponent {
  atsApplication?: IAtsApplication;

  constructor(protected atsApplicationService: AtsApplicationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.atsApplicationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
