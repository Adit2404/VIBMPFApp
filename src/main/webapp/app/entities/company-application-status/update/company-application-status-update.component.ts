import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CompanyApplicationStatusFormService, CompanyApplicationStatusFormGroup } from './company-application-status-form.service';
import { ICompanyApplicationStatus } from '../company-application-status.model';
import { CompanyApplicationStatusService } from '../service/company-application-status.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-company-application-status-update',
  templateUrl: './company-application-status-update.component.html',
})
export class CompanyApplicationStatusUpdateComponent implements OnInit {
  isSaving = false;
  companyApplicationStatus: ICompanyApplicationStatus | null = null;

  companiesSharedCollection: ICompany[] = [];

  editForm: CompanyApplicationStatusFormGroup = this.companyApplicationStatusFormService.createCompanyApplicationStatusFormGroup();

  constructor(
    protected companyApplicationStatusService: CompanyApplicationStatusService,
    protected companyApplicationStatusFormService: CompanyApplicationStatusFormService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyApplicationStatus }) => {
      this.companyApplicationStatus = companyApplicationStatus;
      if (companyApplicationStatus) {
        this.updateForm(companyApplicationStatus);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const companyApplicationStatus = this.companyApplicationStatusFormService.getCompanyApplicationStatus(this.editForm);
    if (companyApplicationStatus.id !== null) {
      this.subscribeToSaveResponse(this.companyApplicationStatusService.update(companyApplicationStatus));
    } else {
      this.subscribeToSaveResponse(this.companyApplicationStatusService.create(companyApplicationStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICompanyApplicationStatus>>): void {
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

  protected updateForm(companyApplicationStatus: ICompanyApplicationStatus): void {
    this.companyApplicationStatus = companyApplicationStatus;
    this.companyApplicationStatusFormService.resetForm(this.editForm, companyApplicationStatus);

    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      companyApplicationStatus.company
    );
  }

  protected loadRelationshipsOptions(): void {
    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) =>
          this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.companyApplicationStatus?.company)
        )
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}
