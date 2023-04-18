import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AtsUserFormService, AtsUserFormGroup } from './ats-user-form.service';
import { IAtsUser } from '../ats-user.model';
import { AtsUserService } from '../service/ats-user.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-ats-user-update',
  templateUrl: './ats-user-update.component.html',
})
export class AtsUserUpdateComponent implements OnInit {
  isSaving = false;
  atsUser: IAtsUser | null = null;

  editForm: AtsUserFormGroup = this.atsUserFormService.createAtsUserFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected atsUserService: AtsUserService,
    protected atsUserFormService: AtsUserFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atsUser }) => {
      this.atsUser = atsUser;
      if (atsUser) {
        this.updateForm(atsUser);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('vibmpfApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const atsUser = this.atsUserFormService.getAtsUser(this.editForm);
    if (atsUser.id !== null) {
      this.subscribeToSaveResponse(this.atsUserService.update(atsUser));
    } else {
      this.subscribeToSaveResponse(this.atsUserService.create(atsUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAtsUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(atsUser: IAtsUser): void {
    this.atsUser = atsUser;
    this.atsUserFormService.resetForm(this.editForm, atsUser);
  }
}
