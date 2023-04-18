import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompanyApplicationStatus, NewCompanyApplicationStatus } from '../company-application-status.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompanyApplicationStatus for edit and NewCompanyApplicationStatusFormGroupInput for create.
 */
type CompanyApplicationStatusFormGroupInput = ICompanyApplicationStatus | PartialWithRequiredKeyOf<NewCompanyApplicationStatus>;

type CompanyApplicationStatusFormDefaults = Pick<NewCompanyApplicationStatus, 'id'>;

type CompanyApplicationStatusFormGroupContent = {
  id: FormControl<ICompanyApplicationStatus['id'] | NewCompanyApplicationStatus['id']>;
  name: FormControl<ICompanyApplicationStatus['name']>;
  company: FormControl<ICompanyApplicationStatus['company']>;
};

export type CompanyApplicationStatusFormGroup = FormGroup<CompanyApplicationStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyApplicationStatusFormService {
  createCompanyApplicationStatusFormGroup(
    companyApplicationStatus: CompanyApplicationStatusFormGroupInput = { id: null }
  ): CompanyApplicationStatusFormGroup {
    const companyApplicationStatusRawValue = {
      ...this.getFormDefaults(),
      ...companyApplicationStatus,
    };
    return new FormGroup<CompanyApplicationStatusFormGroupContent>({
      id: new FormControl(
        { value: companyApplicationStatusRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(companyApplicationStatusRawValue.name),
      company: new FormControl(companyApplicationStatusRawValue.company),
    });
  }

  getCompanyApplicationStatus(form: CompanyApplicationStatusFormGroup): ICompanyApplicationStatus | NewCompanyApplicationStatus {
    return form.getRawValue() as ICompanyApplicationStatus | NewCompanyApplicationStatus;
  }

  resetForm(form: CompanyApplicationStatusFormGroup, companyApplicationStatus: CompanyApplicationStatusFormGroupInput): void {
    const companyApplicationStatusRawValue = { ...this.getFormDefaults(), ...companyApplicationStatus };
    form.reset(
      {
        ...companyApplicationStatusRawValue,
        id: { value: companyApplicationStatusRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompanyApplicationStatusFormDefaults {
    return {
      id: null,
    };
  }
}
