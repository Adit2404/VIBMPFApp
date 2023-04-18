import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CandidateFormService, CandidateFormGroup } from './candidate-form.service';
import { ICandidate } from '../candidate.model';
import { CandidateService } from '../service/candidate.service';
import { IAtsUser } from 'app/entities/ats-user/ats-user.model';
import { AtsUserService } from 'app/entities/ats-user/service/ats-user.service';

@Component({
  selector: 'jhi-candidate-update',
  templateUrl: './candidate-update.component.html',
})
export class CandidateUpdateComponent implements OnInit {
  isSaving = false;
  candidate: ICandidate | null = null;

  atsUsersCollection: IAtsUser[] = [];

  editForm: CandidateFormGroup = this.candidateFormService.createCandidateFormGroup();

  constructor(
    protected candidateService: CandidateService,
    protected candidateFormService: CandidateFormService,
    protected atsUserService: AtsUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareAtsUser = (o1: IAtsUser | null, o2: IAtsUser | null): boolean => this.atsUserService.compareAtsUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.candidate = candidate;
      if (candidate) {
        this.updateForm(candidate);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const candidate = this.candidateFormService.getCandidate(this.editForm);
    if (candidate.id !== null) {
      this.subscribeToSaveResponse(this.candidateService.update(candidate));
    } else {
      this.subscribeToSaveResponse(this.candidateService.create(candidate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidate>>): void {
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

  protected updateForm(candidate: ICandidate): void {
    this.candidate = candidate;
    this.candidateFormService.resetForm(this.editForm, candidate);

    this.atsUsersCollection = this.atsUserService.addAtsUserToCollectionIfMissing<IAtsUser>(this.atsUsersCollection, candidate.atsUser);
  }

  protected loadRelationshipsOptions(): void {
    this.atsUserService
      .query({ filter: 'candidate-is-null' })
      .pipe(map((res: HttpResponse<IAtsUser[]>) => res.body ?? []))
      .pipe(map((atsUsers: IAtsUser[]) => this.atsUserService.addAtsUserToCollectionIfMissing<IAtsUser>(atsUsers, this.candidate?.atsUser)))
      .subscribe((atsUsers: IAtsUser[]) => (this.atsUsersCollection = atsUsers));
  }
}
