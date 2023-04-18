import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vacancy.test-samples';

import { VacancyFormService } from './vacancy-form.service';

describe('Vacancy Form Service', () => {
  let service: VacancyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacancyFormService);
  });

  describe('Service methods', () => {
    describe('createVacancyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacancyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            dateOfPosting: expect.any(Object),
            description: expect.any(Object),
            employmentType: expect.any(Object),
            location: expect.any(Object),
            video: expect.any(Object),
            status: expect.any(Object),
            isOpen: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });

      it('passing IVacancy should create a new form with FormGroup', () => {
        const formGroup = service.createVacancyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            dateOfPosting: expect.any(Object),
            description: expect.any(Object),
            employmentType: expect.any(Object),
            location: expect.any(Object),
            video: expect.any(Object),
            status: expect.any(Object),
            isOpen: expect.any(Object),
            company: expect.any(Object),
          })
        );
      });
    });

    describe('getVacancy', () => {
      it('should return NewVacancy for default Vacancy initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVacancyFormGroup(sampleWithNewData);

        const vacancy = service.getVacancy(formGroup) as any;

        expect(vacancy).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacancy for empty Vacancy initial value', () => {
        const formGroup = service.createVacancyFormGroup();

        const vacancy = service.getVacancy(formGroup) as any;

        expect(vacancy).toMatchObject({});
      });

      it('should return IVacancy', () => {
        const formGroup = service.createVacancyFormGroup(sampleWithRequiredData);

        const vacancy = service.getVacancy(formGroup) as any;

        expect(vacancy).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacancy should not enable id FormControl', () => {
        const formGroup = service.createVacancyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacancy should disable id FormControl', () => {
        const formGroup = service.createVacancyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
