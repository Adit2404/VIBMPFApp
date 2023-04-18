import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICandidate, NewCandidate } from '../candidate.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICandidate for edit and NewCandidateFormGroupInput for create.
 */
type CandidateFormGroupInput = ICandidate | PartialWithRequiredKeyOf<NewCandidate>;

type CandidateFormDefaults = Pick<NewCandidate, 'id'>;

type CandidateFormGroupContent = {
  id: FormControl<ICandidate['id'] | NewCandidate['id']>;
  atsUser: FormControl<ICandidate['atsUser']>;
};

export type CandidateFormGroup = FormGroup<CandidateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CandidateFormService {
  createCandidateFormGroup(candidate: CandidateFormGroupInput = { id: null }): CandidateFormGroup {
    const candidateRawValue = {
      ...this.getFormDefaults(),
      ...candidate,
    };
    return new FormGroup<CandidateFormGroupContent>({
      id: new FormControl(
        { value: candidateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      atsUser: new FormControl(candidateRawValue.atsUser),
    });
  }

  getCandidate(form: CandidateFormGroup): ICandidate | NewCandidate {
    return form.getRawValue() as ICandidate | NewCandidate;
  }

  resetForm(form: CandidateFormGroup, candidate: CandidateFormGroupInput): void {
    const candidateRawValue = { ...this.getFormDefaults(), ...candidate };
    form.reset(
      {
        ...candidateRawValue,
        id: { value: candidateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CandidateFormDefaults {
    return {
      id: null,
    };
  }
}
