import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CompanyFormService, CompanyFormGroup } from './company-form.service';
import { ICompany } from '../company.model';
import { CompanyService } from '../service/company.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-company-update',
  templateUrl: './company-update.component.html',
})
export class CompanyUpdateComponent implements OnInit {
  isSaving = false;
  company: ICompany | null = null;

  editForm: CompanyFormGroup = this.companyFormService.createCompanyFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected companyService: CompanyService,
    protected companyFormService: CompanyFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ company }) => {
      this.company = company;
      if (company) {
        this.updateForm(company);
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
    const company = this.companyFormService.getCompany(this.editForm);
    if (company.id !== null) {
      this.subscribeToSaveResponse(this.companyService.update(company));
    } else {
      this.subscribeToSaveResponse(this.companyService.create(company));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompany>>): void {
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

  protected updateForm(company: ICompany): void {
    this.company = company;
    this.companyFormService.resetForm(this.editForm, company);
  }
}
