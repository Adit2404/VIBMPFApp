import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ats-user.test-samples';

import { AtsUserFormService } from './ats-user-form.service';

describe('AtsUser Form Service', () => {
  let service: AtsUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtsUserFormService);
  });

  describe('Service methods', () => {
    describe('createAtsUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAtsUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            userId: expect.any(Object),
            video: expect.any(Object),
            cv: expect.any(Object),
            password: expect.any(Object),
            usertype: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
          })
        );
      });

      it('passing IAtsUser should create a new form with FormGroup', () => {
        const formGroup = service.createAtsUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            userId: expect.any(Object),
            video: expect.any(Object),
            cv: expect.any(Object),
            password: expect.any(Object),
            usertype: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
          })
        );
      });
    });

    describe('getAtsUser', () => {
      it('should return NewAtsUser for default AtsUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAtsUserFormGroup(sampleWithNewData);

        const atsUser = service.getAtsUser(formGroup) as any;

        expect(atsUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewAtsUser for empty AtsUser initial value', () => {
        const formGroup = service.createAtsUserFormGroup();

        const atsUser = service.getAtsUser(formGroup) as any;

        expect(atsUser).toMatchObject({});
      });

      it('should return IAtsUser', () => {
        const formGroup = service.createAtsUserFormGroup(sampleWithRequiredData);

        const atsUser = service.getAtsUser(formGroup) as any;

        expect(atsUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAtsUser should not enable id FormControl', () => {
        const formGroup = service.createAtsUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAtsUser should disable id FormControl', () => {
        const formGroup = service.createAtsUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
