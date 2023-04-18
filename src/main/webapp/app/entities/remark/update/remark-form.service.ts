import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRemark, NewRemark } from '../remark.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRemark for edit and NewRemarkFormGroupInput for create.
 */
type RemarkFormGroupInput = IRemark | PartialWithRequiredKeyOf<NewRemark>;

type RemarkFormDefaults = Pick<NewRemark, 'id'>;

type RemarkFormGroupContent = {
  id: FormControl<IRemark['id'] | NewRemark['id']>;
  message: FormControl<IRemark['message']>;
  date: FormControl<IRemark['date']>;
  atsApplication: FormControl<IRemark['atsApplication']>;
  companyUser: FormControl<IRemark['companyUser']>;
  candidate: FormControl<IRemark['candidate']>;
};

export type RemarkFormGroup = FormGroup<RemarkFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RemarkFormService {
  createRemarkFormGroup(remark: RemarkFormGroupInput = { id: null }): RemarkFormGroup {
    const remarkRawValue = {
      ...this.getFormDefaults(),
      ...remark,
    };
    return new FormGroup<RemarkFormGroupContent>({
      id: new FormControl(
        { value: remarkRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      message: new FormControl(remarkRawValue.message),
      date: new FormControl(remarkRawValue.date),
      atsApplication: new FormControl(remarkRawValue.atsApplication),
      companyUser: new FormControl(remarkRawValue.companyUser),
      candidate: new FormControl(remarkRawValue.candidate),
    });
  }

  getRemark(form: RemarkFormGroup): IRemark | NewRemark {
    return form.getRawValue() as IRemark | NewRemark;
  }

  resetForm(form: RemarkFormGroup, remark: RemarkFormGroupInput): void {
    const remarkRawValue = { ...this.getFormDefaults(), ...remark };
    form.reset(
      {
        ...remarkRawValue,
        id: { value: remarkRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RemarkFormDefaults {
    return {
      id: null,
    };
  }
}
