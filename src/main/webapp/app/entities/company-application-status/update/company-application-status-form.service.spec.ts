import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../company-application-status.test-samples';

import { CompanyApplicationStatusFormService } from './company-application-status-form.service';

describe('CompanyApplicationStatus Form Service', () => {
  let service: CompanyApplicationStatusFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyApplicationStatusFormService);
  });

  describe('Service methods', () => {
    describe('createCompanyApplicationStatusFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });

      it('passing ICompanyApplicationStatus should create a new form with FormGroup', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });
    });

    describe('getCompanyApplicationStatus', () => {
      it('should return NewCompanyApplicationStatus for default CompanyApplicationStatus initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompanyApplicationStatusFormGroup(sampleWithNewData);

        const companyApplicationStatus = service.getCompanyApplicationStatus(formGroup) as any;

        expect(companyApplicationStatus).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompanyApplicationStatus for empty CompanyApplicationStatus initial value', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup();

        const companyApplicationStatus = service.getCompanyApplicationStatus(formGroup) as any;

        expect(companyApplicationStatus).toMatchObject({});
      });

      it('should return ICompanyApplicationStatus', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup(sampleWithRequiredData);

        const companyApplicationStatus = service.getCompanyApplicationStatus(formGroup) as any;

        expect(companyApplicationStatus).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompanyApplicationStatus should not enable id FormControl', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompanyApplicationStatus should disable id FormControl', () => {
        const formGroup = service.createCompanyApplicationStatusFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
