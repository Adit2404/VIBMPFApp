import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AtsApplicationFormService, AtsApplicationFormGroup } from './ats-application-form.service';
import { IAtsApplication } from '../ats-application.model';
import { AtsApplicationService } from '../service/ats-application.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';
import { IVacancy } from 'app/entities/vacancy/vacancy.model';
import { VacancyService } from 'app/entities/vacancy/service/vacancy.service';
import { ICompanyApplicationStatus } from 'app/entities/company-application-status/company-application-status.model';
import { CompanyApplicationStatusService } from 'app/entities/company-application-status/service/company-application-status.service';

@Component({
  selector: 'jhi-ats-application-update',
  templateUrl: './ats-application-update.component.html',
})
export class AtsApplicationUpdateComponent implements OnInit {
  isSaving = false;
  atsApplication: IAtsApplication | null = null;

  candidatesSharedCollection: ICandidate[] = [];
  vacanciesSharedCollection: IVacancy[] = [];
  companyApplicationStatusesSharedCollection: ICompanyApplicationStatus[] = [];

  editForm: AtsApplicationFormGroup = this.atsApplicationFormService.createAtsApplicationFormGroup();

  constructor(
    protected atsApplicationService: AtsApplicationService,
    protected atsApplicationFormService: AtsApplicationFormService,
    protected candidateService: CandidateService,
    protected vacancyService: VacancyService,
    protected companyApplicationStatusService: CompanyApplicationStatusService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCandidate = (o1: ICandidate | null, o2: ICandidate | null): boolean => this.candidateService.compareCandidate(o1, o2);

  compareVacancy = (o1: IVacancy | null, o2: IVacancy | null): boolean => this.vacancyService.compareVacancy(o1, o2);

  compareCompanyApplicationStatus = (o1: ICompanyApplicationStatus | null, o2: ICompanyApplicationStatus | null): boolean =>
    this.companyApplicationStatusService.compareCompanyApplicationStatus(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atsApplication }) => {
      this.atsApplication = atsApplication;
      if (atsApplication) {
        this.updateForm(atsApplication);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const atsApplication = this.atsApplicationFormService.getAtsApplication(this.editForm);
    if (atsApplication.id !== null) {
      this.subscribeToSaveResponse(this.atsApplicationService.update(atsApplication));
    } else {
      this.subscribeToSaveResponse(this.atsApplicationService.create(atsApplication));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAtsApplication>>): void {
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

  protected updateForm(atsApplication: IAtsApplication): void {
    this.atsApplication = atsApplication;
    this.atsApplicationFormService.resetForm(this.editForm, atsApplication);

    this.candidatesSharedCollection = this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(
      this.candidatesSharedCollection,
      atsApplication.candidate
    );
    this.vacanciesSharedCollection = this.vacancyService.addVacancyToCollectionIfMissing<IVacancy>(
      this.vacanciesSharedCollection,
      atsApplication.vacancy
    );
    this.companyApplicationStatusesSharedCollection =
      this.companyApplicationStatusService.addCompanyApplicationStatusToCollectionIfMissing<ICompanyApplicationStatus>(
        this.companyApplicationStatusesSharedCollection,
        atsApplication.companyApplicationStatus
      );
  }

  protected loadRelationshipsOptions(): void {
    this.candidateService
      .query()
      .pipe(map((res: HttpResponse<ICandidate[]>) => res.body ?? []))
      .pipe(
        map((candidates: ICandidate[]) =>
          this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(candidates, this.atsApplication?.candidate)
        )
      )
      .subscribe((candidates: ICandidate[]) => (this.candidatesSharedCollection = candidates));

    this.vacancyService
      .query()
      .pipe(map((res: HttpResponse<IVacancy[]>) => res.body ?? []))
      .pipe(
        map((vacancies: IVacancy[]) =>
          this.vacancyService.addVacancyToCollectionIfMissing<IVacancy>(vacancies, this.atsApplication?.vacancy)
        )
      )
      .subscribe((vacancies: IVacancy[]) => (this.vacanciesSharedCollection = vacancies));

    this.companyApplicationStatusService
      .query()
      .pipe(map((res: HttpResponse<ICompanyApplicationStatus[]>) => res.body ?? []))
      .pipe(
        map((companyApplicationStatuses: ICompanyApplicationStatus[]) =>
          this.companyApplicationStatusService.addCompanyApplicationStatusToCollectionIfMissing<ICompanyApplicationStatus>(
            companyApplicationStatuses,
            this.atsApplication?.companyApplicationStatus
          )
        )
      )
      .subscribe(
        (companyApplicationStatuses: ICompanyApplicationStatus[]) =>
          (this.companyApplicationStatusesSharedCollection = companyApplicationStatuses)
      );
  }
}
