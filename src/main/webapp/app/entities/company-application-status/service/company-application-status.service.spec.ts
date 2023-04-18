import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompanyApplicationStatus } from '../company-application-status.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../company-application-status.test-samples';

import { CompanyApplicationStatusService } from './company-application-status.service';

const requireRestSample: ICompanyApplicationStatus = {
  ...sampleWithRequiredData,
};

describe('CompanyApplicationStatus Service', () => {
  let service: CompanyApplicationStatusService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompanyApplicationStatus | ICompanyApplicationStatus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompanyApplicationStatusService);
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

    it('should create a CompanyApplicationStatus', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const companyApplicationStatus = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(companyApplicationStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompanyApplicationStatus', () => {
      const companyApplicationStatus = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(companyApplicationStatus).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompanyApplicationStatus', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompanyApplicationStatus', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompanyApplicationStatus', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompanyApplicationStatusToCollectionIfMissing', () => {
      it('should add a CompanyApplicationStatus to an empty array', () => {
        const companyApplicationStatus: ICompanyApplicationStatus = sampleWithRequiredData;
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing([], companyApplicationStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyApplicationStatus);
      });

      it('should not add a CompanyApplicationStatus to an array that contains it', () => {
        const companyApplicationStatus: ICompanyApplicationStatus = sampleWithRequiredData;
        const companyApplicationStatusCollection: ICompanyApplicationStatus[] = [
          {
            ...companyApplicationStatus,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing(
          companyApplicationStatusCollection,
          companyApplicationStatus
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompanyApplicationStatus to an array that doesn't contain it", () => {
        const companyApplicationStatus: ICompanyApplicationStatus = sampleWithRequiredData;
        const companyApplicationStatusCollection: ICompanyApplicationStatus[] = [sampleWithPartialData];
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing(
          companyApplicationStatusCollection,
          companyApplicationStatus
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyApplicationStatus);
      });

      it('should add only unique CompanyApplicationStatus to an array', () => {
        const companyApplicationStatusArray: ICompanyApplicationStatus[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const companyApplicationStatusCollection: ICompanyApplicationStatus[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing(
          companyApplicationStatusCollection,
          ...companyApplicationStatusArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const companyApplicationStatus: ICompanyApplicationStatus = sampleWithRequiredData;
        const companyApplicationStatus2: ICompanyApplicationStatus = sampleWithPartialData;
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing([], companyApplicationStatus, companyApplicationStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyApplicationStatus);
        expect(expectedResult).toContain(companyApplicationStatus2);
      });

      it('should accept null and undefined values', () => {
        const companyApplicationStatus: ICompanyApplicationStatus = sampleWithRequiredData;
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing([], null, companyApplicationStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyApplicationStatus);
      });

      it('should return initial array if no CompanyApplicationStatus is added', () => {
        const companyApplicationStatusCollection: ICompanyApplicationStatus[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyApplicationStatusToCollectionIfMissing(companyApplicationStatusCollection, undefined, null);
        expect(expectedResult).toEqual(companyApplicationStatusCollection);
      });
    });

    describe('compareCompanyApplicationStatus', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompanyApplicationStatus(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompanyApplicationStatus(entity1, entity2);
        const compareResult2 = service.compareCompanyApplicationStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompanyApplicationStatus(entity1, entity2);
        const compareResult2 = service.compareCompanyApplicationStatus(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompanyApplicationStatus(entity1, entity2);
        const compareResult2 = service.compareCompanyApplicationStatus(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
