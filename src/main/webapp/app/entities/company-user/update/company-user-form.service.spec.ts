import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../company-user.test-samples';

import { CompanyUserFormService } from './company-user-form.service';

describe('CompanyUser Form Service', () => {
  let service: CompanyUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyUserFormService);
  });

  describe('Service methods', () => {
    describe('createCompanyUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCompanyUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            atsUser: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });

      it('passing ICompanyUser should create a new form with FormGroup', () => {
        const formGroup = service.createCompanyUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            atsUser: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });
    });

    describe('getCompanyUser', () => {
      it('should return NewCompanyUser for default CompanyUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCompanyUserFormGroup(sampleWithNewData);

        const companyUser = service.getCompanyUser(formGroup) as any;

        expect(companyUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewCompanyUser for empty CompanyUser initial value', () => {
        const formGroup = service.createCompanyUserFormGroup();

        const companyUser = service.getCompanyUser(formGroup) as any;

        expect(companyUser).toMatchObject({});
      });

      it('should return ICompanyUser', () => {
        const formGroup = service.createCompanyUserFormGroup(sampleWithRequiredData);

        const companyUser = service.getCompanyUser(formGroup) as any;

        expect(companyUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICompanyUser should not enable id FormControl', () => {
        const formGroup = service.createCompanyUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCompanyUser should disable id FormControl', () => {
        const formGroup = service.createCompanyUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
