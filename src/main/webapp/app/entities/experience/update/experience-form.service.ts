import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExperience, NewExperience } from '../experience.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExperience for edit and NewExperienceFormGroupInput for create.
 */
type ExperienceFormGroupInput = IExperience | PartialWithRequiredKeyOf<NewExperience>;

type ExperienceFormDefaults = Pick<NewExperience, 'id'>;

type ExperienceFormGroupContent = {
  id: FormControl<IExperience['id'] | NewExperience['id']>;
  title: FormControl<IExperience['title']>;
  company: FormControl<IExperience['company']>;
  location: FormControl<IExperience['location']>;
  sdate: FormControl<IExperience['sdate']>;
  edate: FormControl<IExperience['edate']>;
  description: FormControl<IExperience['description']>;
  candidate: FormControl<IExperience['candidate']>;
};

export type ExperienceFormGroup = FormGroup<ExperienceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExperienceFormService {
  createExperienceFormGroup(experience: ExperienceFormGroupInput = { id: null }): ExperienceFormGroup {
    const experienceRawValue = {
      ...this.getFormDefaults(),
      ...experience,
    };
    return new FormGroup<ExperienceFormGroupContent>({
      id: new FormControl(
        { value: experienceRawValue.id, disabled: experienceRawValue.id !== null },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(experienceRawValue.title),
      company: new FormControl(experienceRawValue.company),
      location: new FormControl(experienceRawValue.location),
      sdate: new FormControl(experienceRawValue.sdate),
      edate: new FormControl(experienceRawValue.edate),
      description: new FormControl(experienceRawValue.description),
      candidate: new FormControl(experienceRawValue.candidate),
    });
  }

  getExperience(form: ExperienceFormGroup): IExperience | NewExperience {
    return form.getRawValue() as IExperience | NewExperience;
  }

  resetForm(form: ExperienceFormGroup, experience: ExperienceFormGroupInput): void {
    const experienceRawValue = { ...this.getFormDefaults(), ...experience };
    form.reset(
      {
        ...experienceRawValue,
        id: { value: experienceRawValue.id, disabled: experienceRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExperienceFormDefaults {
    return {
      id: null,
    };
  }
}
