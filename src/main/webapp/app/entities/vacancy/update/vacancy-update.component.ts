import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VacancyFormService, VacancyFormGroup } from './vacancy-form.service';
import { IVacancy } from '../vacancy.model';
import { VacancyService } from '../service/vacancy.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

@Component({
  selector: 'jhi-vacancy-update',
  templateUrl: './vacancy-update.component.html',
})
export class VacancyUpdateComponent implements OnInit {
  isSaving = false;
  vacancy: IVacancy | null = null;

  companiesSharedCollection: ICompany[] = [];

  editForm: VacancyFormGroup = this.vacancyFormService.createVacancyFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected vacancyService: VacancyService,
    protected vacancyFormService: VacancyFormService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacancy }) => {
      this.vacancy = vacancy;
      if (vacancy) {
        this.updateForm(vacancy);
      }

      this.loadRelationshipsOptions();
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
    const vacancy = this.vacancyFormService.getVacancy(this.editForm);
    if (vacancy.id !== null) {
      this.subscribeToSaveResponse(this.vacancyService.update(vacancy));
    } else {
      this.subscribeToSaveResponse(this.vacancyService.create(vacancy));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacancy>>): void {
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

  protected updateForm(vacancy: IVacancy): void {
    this.vacancy = vacancy;
    this.vacancyFormService.resetForm(this.editForm, vacancy);

    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      vacancy.company
    );
  }

  protected loadRelationshipsOptions(): void {
    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.vacancy?.company)))
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}
