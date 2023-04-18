import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ats-application.test-samples';

import { AtsApplicationFormService } from './ats-application-form.service';

describe('AtsApplication Form Service', () => {
  let service: AtsApplicationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtsApplicationFormService);
  });

  describe('Service methods', () => {
    describe('createAtsApplicationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAtsApplicationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            candidate: expect.any(Object),
            vacancy: expect.any(Object),
            companyApplicationStatus: expect.any(Object),
          })
        );
      });

      it('passing IAtsApplication should create a new form with FormGroup', () => {
        const formGroup = service.createAtsApplicationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            candidate: expect.any(Object),
            vacancy: expect.any(Object),
            companyApplicationStatus: expect.any(Object),
          })
        );
      });
    });

    describe('getAtsApplication', () => {
      it('should return NewAtsApplication for default AtsApplication initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAtsApplicationFormGroup(sampleWithNewData);

        const atsApplication = service.getAtsApplication(formGroup) as any;

        expect(atsApplication).toMatchObject(sampleWithNewData);
      });

      it('should return NewAtsApplication for empty AtsApplication initial value', () => {
        const formGroup = service.createAtsApplicationFormGroup();

        const atsApplication = service.getAtsApplication(formGroup) as any;

        expect(atsApplication).toMatchObject({});
      });

      it('should return IAtsApplication', () => {
        const formGroup = service.createAtsApplicationFormGroup(sampleWithRequiredData);

        const atsApplication = service.getAtsApplication(formGroup) as any;

        expect(atsApplication).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAtsApplication should not enable id FormControl', () => {
        const formGroup = service.createAtsApplicationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAtsApplication should disable id FormControl', () => {
        const formGroup = service.createAtsApplicationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
