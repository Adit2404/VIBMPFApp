import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RemarkFormService, RemarkFormGroup } from './remark-form.service';
import { IRemark } from '../remark.model';
import { RemarkService } from '../service/remark.service';
import { IAtsApplication } from 'app/entities/ats-application/ats-application.model';
import { AtsApplicationService } from 'app/entities/ats-application/service/ats-application.service';
import { ICompanyUser } from 'app/entities/company-user/company-user.model';
import { CompanyUserService } from 'app/entities/company-user/service/company-user.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

@Component({
  selector: 'jhi-remark-update',
  templateUrl: './remark-update.component.html',
})
export class RemarkUpdateComponent implements OnInit {
  isSaving = false;
  remark: IRemark | null = null;

  atsApplicationsSharedCollection: IAtsApplication[] = [];
  companyUsersSharedCollection: ICompanyUser[] = [];
  candidatesSharedCollection: ICandidate[] = [];

  editForm: RemarkFormGroup = this.remarkFormService.createRemarkFormGroup();

  constructor(
    protected remarkService: RemarkService,
    protected remarkFormService: RemarkFormService,
    protected atsApplicationService: AtsApplicationService,
    protected companyUserService: CompanyUserService,
    protected candidateService: CandidateService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAtsApplication = (o1: IAtsApplication | null, o2: IAtsApplication | null): boolean =>
    this.atsApplicationService.compareAtsApplication(o1, o2);

  compareCompanyUser = (o1: ICompanyUser | null, o2: ICompanyUser | null): boolean => this.companyUserService.compareCompanyUser(o1, o2);

  compareCandidate = (o1: ICandidate | null, o2: ICandidate | null): boolean => this.candidateService.compareCandidate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ remark }) => {
      this.remark = remark;
      if (remark) {
        this.updateForm(remark);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const remark = this.remarkFormService.getRemark(this.editForm);
    if (remark.id !== null) {
      this.subscribeToSaveResponse(this.remarkService.update(remark));
    } else {
      this.subscribeToSaveResponse(this.remarkService.create(remark));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRemark>>): void {
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

  protected updateForm(remark: IRemark): void {
    this.remark = remark;
    this.remarkFormService.resetForm(this.editForm, remark);

    this.atsApplicationsSharedCollection = this.atsApplicationService.addAtsApplicationToCollectionIfMissing<IAtsApplication>(
      this.atsApplicationsSharedCollection,
      remark.atsApplication
    );
    this.companyUsersSharedCollection = this.companyUserService.addCompanyUserToCollectionIfMissing<ICompanyUser>(
      this.companyUsersSharedCollection,
      remark.companyUser
    );
    this.candidatesSharedCollection = this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(
      this.candidatesSharedCollection,
      remark.candidate
    );
  }

  protected loadRelationshipsOptions(): void {
    this.atsApplicationService
      .query()
      .pipe(map((res: HttpResponse<IAtsApplication[]>) => res.body ?? []))
      .pipe(
        map((atsApplications: IAtsApplication[]) =>
          this.atsApplicationService.addAtsApplicationToCollectionIfMissing<IAtsApplication>(atsApplications, this.remark?.atsApplication)
        )
      )
      .subscribe((atsApplications: IAtsApplication[]) => (this.atsApplicationsSharedCollection = atsApplications));

    this.companyUserService
      .query()
      .pipe(map((res: HttpResponse<ICompanyUser[]>) => res.body ?? []))
      .pipe(
        map((companyUsers: ICompanyUser[]) =>
          this.companyUserService.addCompanyUserToCollectionIfMissing<ICompanyUser>(companyUsers, this.remark?.companyUser)
        )
      )
      .subscribe((companyUsers: ICompanyUser[]) => (this.companyUsersSharedCollection = companyUsers));

    this.candidateService
      .query()
      .pipe(map((res: HttpResponse<ICandidate[]>) => res.body ?? []))
      .pipe(
        map((candidates: ICandidate[]) =>
          this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(candidates, this.remark?.candidate)
        )
      )
      .subscribe((candidates: ICandidate[]) => (this.candidatesSharedCollection = candidates));
  }
}
