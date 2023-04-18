import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompanyUser } from '../company-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../company-user.test-samples';

import { CompanyUserService } from './company-user.service';

const requireRestSample: ICompanyUser = {
  ...sampleWithRequiredData,
};

describe('CompanyUser Service', () => {
  let service: CompanyUserService;
  let httpMock: HttpTestingController;
  let expectedResult: ICompanyUser | ICompanyUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CompanyUserService);
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

    it('should create a CompanyUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const companyUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(companyUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CompanyUser', () => {
      const companyUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(companyUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CompanyUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CompanyUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CompanyUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCompanyUserToCollectionIfMissing', () => {
      it('should add a CompanyUser to an empty array', () => {
        const companyUser: ICompanyUser = sampleWithRequiredData;
        expectedResult = service.addCompanyUserToCollectionIfMissing([], companyUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyUser);
      });

      it('should not add a CompanyUser to an array that contains it', () => {
        const companyUser: ICompanyUser = sampleWithRequiredData;
        const companyUserCollection: ICompanyUser[] = [
          {
            ...companyUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCompanyUserToCollectionIfMissing(companyUserCollection, companyUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CompanyUser to an array that doesn't contain it", () => {
        const companyUser: ICompanyUser = sampleWithRequiredData;
        const companyUserCollection: ICompanyUser[] = [sampleWithPartialData];
        expectedResult = service.addCompanyUserToCollectionIfMissing(companyUserCollection, companyUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyUser);
      });

      it('should add only unique CompanyUser to an array', () => {
        const companyUserArray: ICompanyUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const companyUserCollection: ICompanyUser[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyUserToCollectionIfMissing(companyUserCollection, ...companyUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const companyUser: ICompanyUser = sampleWithRequiredData;
        const companyUser2: ICompanyUser = sampleWithPartialData;
        expectedResult = service.addCompanyUserToCollectionIfMissing([], companyUser, companyUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(companyUser);
        expect(expectedResult).toContain(companyUser2);
      });

      it('should accept null and undefined values', () => {
        const companyUser: ICompanyUser = sampleWithRequiredData;
        expectedResult = service.addCompanyUserToCollectionIfMissing([], null, companyUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(companyUser);
      });

      it('should return initial array if no CompanyUser is added', () => {
        const companyUserCollection: ICompanyUser[] = [sampleWithRequiredData];
        expectedResult = service.addCompanyUserToCollectionIfMissing(companyUserCollection, undefined, null);
        expect(expectedResult).toEqual(companyUserCollection);
      });
    });

    describe('compareCompanyUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCompanyUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCompanyUser(entity1, entity2);
        const compareResult2 = service.compareCompanyUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCompanyUser(entity1, entity2);
        const compareResult2 = service.compareCompanyUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCompanyUser(entity1, entity2);
        const compareResult2 = service.compareCompanyUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
