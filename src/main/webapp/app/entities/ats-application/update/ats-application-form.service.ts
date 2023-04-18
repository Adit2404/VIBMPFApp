import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAtsApplication, NewAtsApplication } from '../ats-application.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAtsApplication for edit and NewAtsApplicationFormGroupInput for create.
 */
type AtsApplicationFormGroupInput = IAtsApplication | PartialWithRequiredKeyOf<NewAtsApplication>;

type AtsApplicationFormDefaults = Pick<NewAtsApplication, 'id'>;

type AtsApplicationFormGroupContent = {
  id: FormControl<IAtsApplication['id'] | NewAtsApplication['id']>;
  date: FormControl<IAtsApplication['date']>;
  candidate: FormControl<IAtsApplication['candidate']>;
  vacancy: FormControl<IAtsApplication['vacancy']>;
  companyApplicationStatus: FormControl<IAtsApplication['companyApplicationStatus']>;
};

export type AtsApplicationFormGroup = FormGroup<AtsApplicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AtsApplicationFormService {
  createAtsApplicationFormGroup(atsApplication: AtsApplicationFormGroupInput = { id: null }): AtsApplicationFormGroup {
    const atsApplicationRawValue = {
      ...this.getFormDefaults(),
      ...atsApplication,
    };
    return new FormGroup<AtsApplicationFormGroupContent>({
      id: new FormControl(
        { value: atsApplicationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(atsApplicationRawValue.date),
      candidate: new FormControl(atsApplicationRawValue.candidate),
      vacancy: new FormControl(atsApplicationRawValue.vacancy),
      companyApplicationStatus: new FormControl(atsApplicationRawValue.companyApplicationStatus),
    });
  }

  getAtsApplication(form: AtsApplicationFormGroup): IAtsApplication | NewAtsApplication {
    return form.getRawValue() as IAtsApplication | NewAtsApplication;
  }

  resetForm(form: AtsApplicationFormGroup, atsApplication: AtsApplicationFormGroupInput): void {
    const atsApplicationRawValue = { ...this.getFormDefaults(), ...atsApplication };
    form.reset(
      {
        ...atsApplicationRawValue,
        id: { value: atsApplicationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AtsApplicationFormDefaults {
    return {
      id: null,
    };
  }
}
