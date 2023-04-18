import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAtsApplication } from '../ats-application.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ats-application.test-samples';

import { AtsApplicationService, RestAtsApplication } from './ats-application.service';

const requireRestSample: RestAtsApplication = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('AtsApplication Service', () => {
  let service: AtsApplicationService;
  let httpMock: HttpTestingController;
  let expectedResult: IAtsApplication | IAtsApplication[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AtsApplicationService);
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

    it('should create a AtsApplication', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const atsApplication = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(atsApplication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AtsApplication', () => {
      const atsApplication = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(atsApplication).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AtsApplication', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AtsApplication', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AtsApplication', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAtsApplicationToCollectionIfMissing', () => {
      it('should add a AtsApplication to an empty array', () => {
        const atsApplication: IAtsApplication = sampleWithRequiredData;
        expectedResult = service.addAtsApplicationToCollectionIfMissing([], atsApplication);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(atsApplication);
      });

      it('should not add a AtsApplication to an array that contains it', () => {
        const atsApplication: IAtsApplication = sampleWithRequiredData;
        const atsApplicationCollection: IAtsApplication[] = [
          {
            ...atsApplication,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAtsApplicationToCollectionIfMissing(atsApplicationCollection, atsApplication);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AtsApplication to an array that doesn't contain it", () => {
        const atsApplication: IAtsApplication = sampleWithRequiredData;
        const atsApplicationCollection: IAtsApplication[] = [sampleWithPartialData];
        expectedResult = service.addAtsApplicationToCollectionIfMissing(atsApplicationCollection, atsApplication);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(atsApplication);
      });

      it('should add only unique AtsApplication to an array', () => {
        const atsApplicationArray: IAtsApplication[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const atsApplicationCollection: IAtsApplication[] = [sampleWithRequiredData];
        expectedResult = service.addAtsApplicationToCollectionIfMissing(atsApplicationCollection, ...atsApplicationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const atsApplication: IAtsApplication = sampleWithRequiredData;
        const atsApplication2: IAtsApplication = sampleWithPartialData;
        expectedResult = service.addAtsApplicationToCollectionIfMissing([], atsApplication, atsApplication2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(atsApplication);
        expect(expectedResult).toContain(atsApplication2);
      });

      it('should accept null and undefined values', () => {
        const atsApplication: IAtsApplication = sampleWithRequiredData;
        expectedResult = service.addAtsApplicationToCollectionIfMissing([], null, atsApplication, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(atsApplication);
      });

      it('should return initial array if no AtsApplication is added', () => {
        const atsApplicationCollection: IAtsApplication[] = [sampleWithRequiredData];
        expectedResult = service.addAtsApplicationToCollectionIfMissing(atsApplicationCollection, undefined, null);
        expect(expectedResult).toEqual(atsApplicationCollection);
      });
    });

    describe('compareAtsApplication', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAtsApplication(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAtsApplication(entity1, entity2);
        const compareResult2 = service.compareAtsApplication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAtsApplication(entity1, entity2);
        const compareResult2 = service.compareAtsApplication(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAtsApplication(entity1, entity2);
        const compareResult2 = service.compareAtsApplication(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
