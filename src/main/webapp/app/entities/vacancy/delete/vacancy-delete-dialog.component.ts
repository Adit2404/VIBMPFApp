import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacancy } from '../vacancy.model';
import { VacancyService } from '../service/vacancy.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vacancy-delete-dialog.component.html',
})
export class VacancyDeleteDialogComponent {
  vacancy?: IVacancy;

  constructor(protected vacancyService: VacancyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vacancyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
