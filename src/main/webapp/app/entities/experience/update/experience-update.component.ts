import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExperienceFormService, ExperienceFormGroup } from './experience-form.service';
import { IExperience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

@Component({
  selector: 'jhi-experience-update',
  templateUrl: './experience-update.component.html',
})
export class ExperienceUpdateComponent implements OnInit {
  isSaving = false;
  experience: IExperience | null = null;

  candidatesSharedCollection: ICandidate[] = [];

  editForm: ExperienceFormGroup = this.experienceFormService.createExperienceFormGroup();

  constructor(
    protected experienceService: ExperienceService,
    protected experienceFormService: ExperienceFormService,
    protected candidateService: CandidateService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCandidate = (o1: ICandidate | null, o2: ICandidate | null): boolean => this.candidateService.compareCandidate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ experience }) => {
      this.experience = experience;
      if (experience) {
        this.updateForm(experience);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const experience = this.experienceFormService.getExperience(this.editForm);
    if (experience.id !== null) {
      this.subscribeToSaveResponse(this.experienceService.update(experience));
    } else {
      this.subscribeToSaveResponse(this.experienceService.create(experience));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExperience>>): void {
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

  protected updateForm(experience: IExperience): void {
    this.experience = experience;
    this.experienceFormService.resetForm(this.editForm, experience);

    this.candidatesSharedCollection = this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(
      this.candidatesSharedCollection,
      experience.candidate
    );
  }

  protected loadRelationshipsOptions(): void {
    this.candidateService
      .query()
      .pipe(map((res: HttpResponse<ICandidate[]>) => res.body ?? []))
      .pipe(
        map((candidates: ICandidate[]) =>
          this.candidateService.addCandidateToCollectionIfMissing<ICandidate>(candidates, this.experience?.candidate)
        )
      )
      .subscribe((candidates: ICandidate[]) => (this.candidatesSharedCollection = candidates));
  }
}
