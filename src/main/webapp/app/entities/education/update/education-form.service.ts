import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEducation, NewEducation } from '../education.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEducation for edit and NewEducationFormGroupInput for create.
 */
type EducationFormGroupInput = IEducation | PartialWithRequiredKeyOf<NewEducation>;

type EducationFormDefaults = Pick<NewEducation, 'id'>;

type EducationFormGroupContent = {
  id: FormControl<IEducation['id'] | NewEducation['id']>;
  title: FormControl<IEducation['title']>;
  company: FormControl<IEducation['company']>;
  location: FormControl<IEducation['location']>;
  sdate: FormControl<IEducation['sdate']>;
  edate: FormControl<IEducation['edate']>;
  description: FormControl<IEducation['description']>;
  candidate: FormControl<IEducation['candidate']>;
};

export type EducationFormGroup = FormGroup<EducationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EducationFormService {
  createEducationFormGroup(education: EducationFormGroupInput = { id: null }): EducationFormGroup {
    const educationRawValue = {
      ...this.getFormDefaults(),
      ...education,
    };
    return new FormGroup<EducationFormGroupContent>({
      id: new FormControl(
        { value: educationRawValue.id, disabled: educationRawValue.id !== null },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(educationRawValue.title),
      company: new FormControl(educationRawValue.company),
      location: new FormControl(educationRawValue.location),
      sdate: new FormControl(educationRawValue.sdate),
      edate: new FormControl(educationRawValue.edate),
      description: new FormControl(educationRawValue.description),
      candidate: new FormControl(educationRawValue.candidate),
    });
  }

  getEducation(form: EducationFormGroup): IEducation | NewEducation {
    return form.getRawValue() as IEducation | NewEducation;
  }

  resetForm(form: EducationFormGroup, education: EducationFormGroupInput): void {
    const educationRawValue = { ...this.getFormDefaults(), ...education };
    form.reset(
      {
        ...educationRawValue,
        id: { value: educationRawValue.id, disabled: educationRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EducationFormDefaults {
    return {
      id: null,
    };
  }
}
