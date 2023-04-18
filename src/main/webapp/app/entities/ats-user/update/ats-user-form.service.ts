import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAtsUser, NewAtsUser } from '../ats-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAtsUser for edit and NewAtsUserFormGroupInput for create.
 */
type AtsUserFormGroupInput = IAtsUser | PartialWithRequiredKeyOf<NewAtsUser>;

type AtsUserFormDefaults = Pick<NewAtsUser, 'id'>;

type AtsUserFormGroupContent = {
  id: FormControl<IAtsUser['id'] | NewAtsUser['id']>;
  firstName: FormControl<IAtsUser['firstName']>;
  lastName: FormControl<IAtsUser['lastName']>;
  email: FormControl<IAtsUser['email']>;
  phoneNumber: FormControl<IAtsUser['phoneNumber']>;
  userId: FormControl<IAtsUser['userId']>;
  video: FormControl<IAtsUser['video']>;
  videoContentType: FormControl<IAtsUser['videoContentType']>;
  cv: FormControl<IAtsUser['cv']>;
  cvContentType: FormControl<IAtsUser['cvContentType']>;
  password: FormControl<IAtsUser['password']>;
  usertype: FormControl<IAtsUser['usertype']>;
  streetAddress: FormControl<IAtsUser['streetAddress']>;
  postalCode: FormControl<IAtsUser['postalCode']>;
  city: FormControl<IAtsUser['city']>;
  stateProvince: FormControl<IAtsUser['stateProvince']>;
};

export type AtsUserFormGroup = FormGroup<AtsUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AtsUserFormService {
  createAtsUserFormGroup(atsUser: AtsUserFormGroupInput = { id: null }): AtsUserFormGroup {
    const atsUserRawValue = {
      ...this.getFormDefaults(),
      ...atsUser,
    };
    return new FormGroup<AtsUserFormGroupContent>({
      id: new FormControl(
        { value: atsUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(atsUserRawValue.firstName),
      lastName: new FormControl(atsUserRawValue.lastName),
      email: new FormControl(atsUserRawValue.email),
      phoneNumber: new FormControl(atsUserRawValue.phoneNumber),
      userId: new FormControl(atsUserRawValue.userId),
      video: new FormControl(atsUserRawValue.video),
      videoContentType: new FormControl(atsUserRawValue.videoContentType),
      cv: new FormControl(atsUserRawValue.cv),
      cvContentType: new FormControl(atsUserRawValue.cvContentType),
      password: new FormControl(atsUserRawValue.password),
      usertype: new FormControl(atsUserRawValue.usertype),
      streetAddress: new FormControl(atsUserRawValue.streetAddress),
      postalCode: new FormControl(atsUserRawValue.postalCode),
      city: new FormControl(atsUserRawValue.city),
      stateProvince: new FormControl(atsUserRawValue.stateProvince),
    });
  }

  getAtsUser(form: AtsUserFormGroup): IAtsUser | NewAtsUser {
    return form.getRawValue() as IAtsUser | NewAtsUser;
  }

  resetForm(form: AtsUserFormGroup, atsUser: AtsUserFormGroupInput): void {
    const atsUserRawValue = { ...this.getFormDefaults(), ...atsUser };
    form.reset(
      {
        ...atsUserRawValue,
        id: { value: atsUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AtsUserFormDefaults {
    return {
      id: null,
    };
  }
}
