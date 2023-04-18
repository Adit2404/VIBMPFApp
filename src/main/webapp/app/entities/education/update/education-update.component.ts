import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EducationFormService, EducationFormGroup } from './education-form.service';
import { IEducation } from '../education.model';
import { EducationService } from '../service/education.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

@Component({
  selector: 'jhi-education-update',
  templateUrl: './education-update.component.html',
})
export class EducationUpdateComponent implements OnInit {
  isSaving = false;
  education: IEducation | null = null;

  candidatesSharedCollection: ICandidate[] = [];

  editForm: EducationFormGroup = this.educationFormService.createEducationFormGroup();

  constructor(
    protected educationService: EducationService,
    protected educationFormService: EducationFormService,
    protected candidateService: CandidateService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCandidate = (o1: ICandidate | null, o2: ICandidate | null): boolean => this.candidateService.compareCandidate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ education }) => {
      this.education = education;
      if (education) {
        this.updateForm(education);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const education = this.educationFormService.getEducation(this.editForm);
    if (education.id !== null) {
      this.subscribeToSaveResponse(this.educationService.update(education));
    } else {
      this.subscribeToSaveResponse(this.educationService.create(education));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEducation>>): void {
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

  protected updateForm(education: IEducation): void {
    this.education = education;
    this.educationFormService.resetForm(this.editForm, education);

    this.candidatesSharedCollection = this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(
      this.candidatesSharedCollection,
      education.candidate
    );
  }

  protected loadRelationshipsOptions(): void {
    this.candidateService
      .query()
      .pipe(map((res: HttpResponse<ICandidate[]>) => res.body ?? []))
      .pipe(
        map((candidates: ICandidate[]) =>
          this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(candidates, this.education?.candidate)
        )
      )
      .subscribe((candidates: ICandidate[]) => (this.candidatesSharedCollection = candidates));
  }
}
