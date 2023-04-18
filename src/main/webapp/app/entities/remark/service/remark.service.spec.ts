import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRemark } from '../remark.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../remark.test-samples';

import { RemarkService, RestRemark } from './remark.service';

const requireRestSample: RestRemark = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Remark Service', () => {
  let service: RemarkService;
  let httpMock: HttpTestingController;
  let expectedResult: IRemark | IRemark[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RemarkService);
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

    it('should create a Remark', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const remark = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(remark).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Remark', () => {
      const remark = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(remark).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Remark', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Remark', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Remark', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRemarkToCollectionIfMissing', () => {
      it('should add a Remark to an empty array', () => {
        const remark: IRemark = sampleWithRequiredData;
        expectedResult = service.addRemarkToCollectionIfMissing([], remark);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(remark);
      });

      it('should not add a Remark to an array that contains it', () => {
        const remark: IRemark = sampleWithRequiredData;
        const remarkCollection: IRemark[] = [
          {
            ...remark,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRemarkToCollectionIfMissing(remarkCollection, remark);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Remark to an array that doesn't contain it", () => {
        const remark: IRemark = sampleWithRequiredData;
        const remarkCollection: IRemark[] = [sampleWithPartialData];
        expectedResult = service.addRemarkToCollectionIfMissing(remarkCollection, remark);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(remark);
      });

      it('should add only unique Remark to an array', () => {
        const remarkArray: IRemark[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const remarkCollection: IRemark[] = [sampleWithRequiredData];
        expectedResult = service.addRemarkToCollectionIfMissing(remarkCollection, ...remarkArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const remark: IRemark = sampleWithRequiredData;
        const remark2: IRemark = sampleWithPartialData;
        expectedResult = service.addRemarkToCollectionIfMissing([], remark, remark2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(remark);
        expect(expectedResult).toContain(remark2);
      });

      it('should accept null and undefined values', () => {
        const remark: IRemark = sampleWithRequiredData;
        expectedResult = service.addRemarkToCollectionIfMissing([], null, remark, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(remark);
      });

      it('should return initial array if no Remark is added', () => {
        const remarkCollection: IRemark[] = [sampleWithRequiredData];
        expectedResult = service.addRemarkToCollectionIfMissing(remarkCollection, undefined, null);
        expect(expectedResult).toEqual(remarkCollection);
      });
    });

    describe('compareRemark', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRemark(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRemark(entity1, entity2);
        const compareResult2 = service.compareRemark(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRemark(entity1, entity2);
        const compareResult2 = service.compareRemark(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRemark(entity1, entity2);
        const compareResult2 = service.compareRemark(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
