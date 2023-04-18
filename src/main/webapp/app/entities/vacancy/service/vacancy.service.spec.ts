import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVacancy } from '../vacancy.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vacancy.test-samples';

import { VacancyService, RestVacancy } from './vacancy.service';

const requireRestSample: RestVacancy = {
  ...sampleWithRequiredData,
  dateOfPosting: sampleWithRequiredData.dateOfPosting?.format(DATE_FORMAT),
};

describe('Vacancy Service', () => {
  let service: VacancyService;
  let httpMock: HttpTestingController;
  let expectedResult: IVacancy | IVacancy[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VacancyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Vacancy', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vacancy = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vacancy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vacancy', () => {
      const vacancy = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vacancy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vacancy', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vacancy', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vacancy', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVacancyToCollectionIfMissing', () => {
      it('should add a Vacancy to an empty array', () => {
        const vacancy: IVacancy = sampleWithRequiredData;
        expectedResult = service.addVacancyToCollectionIfMissing([], vacancy);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacancy);
      });

      it('should not add a Vacancy to an array that contains it', () => {
        const vacancy: IVacancy = sampleWithRequiredData;
        const vacancyCollection: IVacancy[] = [
          {
            ...vacancy,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVacancyToCollectionIfMissing(vacancyCollection, vacancy);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vacancy to an array that doesn't contain it", () => {
        const vacancy: IVacancy = sampleWithRequiredData;
        const vacancyCollection: IVacancy[] = [sampleWithPartialData];
        expectedResult = service.addVacancyToCollectionIfMissing(vacancyCollection, vacancy);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacancy);
      });

      it('should add only unique Vacancy to an array', () => {
        const vacancyArray: IVacancy[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vacancyCollection: IVacancy[] = [sampleWithRequiredData];
        expectedResult = service.addVacancyToCollectionIfMissing(vacancyCollection, ...vacancyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vacancy: IVacancy = sampleWithRequiredData;
        const vacancy2: IVacancy = sampleWithPartialData;
        expectedResult = service.addVacancyToCollectionIfMissing([], vacancy, vacancy2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacancy);
        expect(expectedResult).toContain(vacancy2);
      });

      it('should accept null and undefined values', () => {
        const vacancy: IVacancy = sampleWithRequiredData;
        expectedResult = service.addVacancyToCollectionIfMissing([], null, vacancy, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacancy);
      });

      it('should return initial array if no Vacancy is added', () => {
        const vacancyCollection: IVacancy[] = [sampleWithRequiredData];
        expectedResult = service.addVacancyToCollectionIfMissing(vacancyCollection, undefined, null);
        expect(expectedResult).toEqual(vacancyCollection);
      });
    });

    describe('compareVacancy', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVacancy(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVacancy(entity1, entity2);
        const compareResult2 = service.compareVacancy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVacancy(entity1, entity2);
        const compareResult2 = service.compareVacancy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVacancy(entity1, entity2);
        const compareResult2 = service.compareVacancy(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
