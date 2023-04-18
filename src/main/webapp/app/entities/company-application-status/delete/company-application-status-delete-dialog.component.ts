import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompanyApplicationStatus } from '../company-application-status.model';
import { CompanyApplicationStatusService } from '../service/company-application-status.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './company-application-status-delete-dialog.component.html',
})
export class CompanyApplicationStatusDeleteDialogComponent {
  companyApplicationStatus?: ICompanyApplicationStatus;

  constructor(protected companyApplicationStatusService: CompanyApplicationStatusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.companyApplicationStatusService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
