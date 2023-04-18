import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVacancy, NewVacancy } from '../vacancy.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacancy for edit and NewVacancyFormGroupInput for create.
 */
type VacancyFormGroupInput = IVacancy | PartialWithRequiredKeyOf<NewVacancy>;

type VacancyFormDefaults = Pick<NewVacancy, 'id' | 'isOpen'>;

type VacancyFormGroupContent = {
  id: FormControl<IVacancy['id'] | NewVacancy['id']>;
  name: FormControl<IVacancy['name']>;
  dateOfPosting: FormControl<IVacancy['dateOfPosting']>;
  description: FormControl<IVacancy['description']>;
  employmentType: FormControl<IVacancy['employmentType']>;
  location: FormControl<IVacancy['location']>;
  video: FormControl<IVacancy['video']>;
  videoContentType: FormControl<IVacancy['videoContentType']>;
  status: FormControl<IVacancy['status']>;
  isOpen: FormControl<IVacancy['isOpen']>;
  company: FormControl<IVacancy['company']>;
};

export type VacancyFormGroup = FormGroup<VacancyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacancyFormService {
  createVacancyFormGroup(vacancy: VacancyFormGroupInput = { id: null }): VacancyFormGroup {
    const vacancyRawValue = {
      ...this.getFormDefaults(),
      ...vacancy,
    };
    return new FormGroup<VacancyFormGroupContent>({
      id: new FormControl(
        { value: vacancyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(vacancyRawValue.name),
      dateOfPosting: new FormControl(vacancyRawValue.dateOfPosting),
      description: new FormControl(vacancyRawValue.description),
      employmentType: new FormControl(vacancyRawValue.employmentType),
      location: new FormControl(vacancyRawValue.location),
      video: new FormControl(vacancyRawValue.video),
      videoContentType: new FormControl(vacancyRawValue.videoContentType),
      status: new FormControl(vacancyRawValue.status),
      isOpen: new FormControl(vacancyRawValue.isOpen),
      company: new FormControl(vacancyRawValue.company),
    });
  }

  getVacancy(form: VacancyFormGroup): IVacancy | NewVacancy {
    return form.getRawValue() as IVacancy | NewVacancy;
  }

  resetForm(form: VacancyFormGroup, vacancy: VacancyFormGroupInput): void {
    const vacancyRawValue = { ...this.getFormDefaults(), ...vacancy };
    form.reset(
      {
        ...vacancyRawValue,
        id: { value: vacancyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VacancyFormDefaults {
    return {
      id: null,
      isOpen: false,
    };
  }
}
