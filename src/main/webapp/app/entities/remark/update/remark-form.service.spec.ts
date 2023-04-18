import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../remark.test-samples';

import { RemarkFormService } from './remark-form.service';

describe('Remark Form Service', () => {
  let service: RemarkFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemarkFormService);
  });

  describe('Service methods', () => {
    describe('createRemarkFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRemarkFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            message: expect.any(Object),
            date: expect.any(Object),
            atsApplication: expect.any(Object),
            companyUser: expect.any(Object),
            candidate: expect.any(Object),
          })
        );
      });

      it('passing IRemark should create a new form with FormGroup', () => {
        const formGroup = service.createRemarkFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            message: expect.any(Object),
            date: expect.any(Object),
            atsApplication: expect.any(Object),
            companyUser: expect.any(Object),
            candidate: expect.any(Object),
          })
        );
      });
    });

    describe('getRemark', () => {
      it('should return NewRemark for default Remark initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRemarkFormGroup(sampleWithNewData);

        const remark = service.getRemark(formGroup) as any;

        expect(remark).toMatchObject(sampleWithNewData);
      });

      it('should return NewRemark for empty Remark initial value', () => {
        const formGroup = service.createRemarkFormGroup();

        const remark = service.getRemark(formGroup) as any;

        expect(remark).toMatchObject({});
      });

      it('should return IRemark', () => {
        const formGroup = service.createRemarkFormGroup(sampleWithRequiredData);

        const remark = service.getRemark(formGroup) as any;

        expect(remark).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRemark should not enable id FormControl', () => {
        const formGroup = service.createRemarkFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRemark should disable id FormControl', () => {
        const formGroup = service.createRemarkFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
