import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICompanyUser, NewCompanyUser } from '../company-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICompanyUser for edit and NewCompanyUserFormGroupInput for create.
 */
type CompanyUserFormGroupInput = ICompanyUser | PartialWithRequiredKeyOf<NewCompanyUser>;

type CompanyUserFormDefaults = Pick<NewCompanyUser, 'id'>;

type CompanyUserFormGroupContent = {
  id: FormControl<ICompanyUser['id'] | NewCompanyUser['id']>;
  atsUser: FormControl<ICompanyUser['atsUser']>;
  company: FormControl<ICompanyUser['company']>;
};

export type CompanyUserFormGroup = FormGroup<CompanyUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CompanyUserFormService {
  createCompanyUserFormGroup(companyUser: CompanyUserFormGroupInput = { id: null }): CompanyUserFormGroup {
    const companyUserRawValue = {
      ...this.getFormDefaults(),
      ...companyUser,
    };
    return new FormGroup<CompanyUserFormGroupContent>({
      id: new FormControl(
        { value: companyUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      atsUser: new FormControl(companyUserRawValue.atsUser),
      company: new FormControl(companyUserRawValue.company),
    });
  }

  getCompanyUser(form: CompanyUserFormGroup): ICompanyUser | NewCompanyUser {
    return form.getRawValue() as ICompanyUser | NewCompanyUser;
  }

  resetForm(form: CompanyUserFormGroup, companyUser: CompanyUserFormGroupInput): void {
    const companyUserRawValue = { ...this.getFormDefaults(), ...companyUser };
    form.reset(
      {
        ...companyUserRawValue,
        id: { value: companyUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CompanyUserFormDefaults {
    return {
      id: null,
    };
  }
}
