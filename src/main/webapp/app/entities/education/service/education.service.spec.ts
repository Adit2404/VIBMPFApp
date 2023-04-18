import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEducation } from '../education.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../education.test-samples';

import { EducationService, RestEducation } from './education.service';

const requireRestSample: RestEducation = {
  ...sampleWithRequiredData,
  sdate: sampleWithRequiredData.sdate?.format(DATE_FORMAT),
  edate: sampleWithRequiredData.edate?.format(DATE_FORMAT),
};

describe('Education Service', () => {
  let service: EducationService;
  let httpMock: HttpTestingController;
  let expectedResult: IEducation | IEducation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EducationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Education', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const education = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(education).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Education', () => {
      const education = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(education).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Education', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Education', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Education', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEducationToCollectionIfMissing', () => {
      it('should add a Education to an empty array', () => {
        const education: IEducation = sampleWithRequiredData;
        expectedResult = service.addEducationToCollectionIfMissing([], education);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(education);
      });

      it('should not add a Education to an array that contains it', () => {
        const education: IEducation = sampleWithRequiredData;
        const educationCollection: IEducation[] = [
          {
            ...education,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEducationToCollectionIfMissing(educationCollection, education);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Education to an array that doesn't contain it", () => {
        const education: IEducation = sampleWithRequiredData;
        const educationCollection: IEducation[] = [sampleWithPartialData];
        expectedResult = service.addEducationToCollectionIfMissing(educationCollection, education);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(education);
      });

      it('should add only unique Education to an array', () => {
        const educationArray: IEducation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const educationCollection: IEducation[] = [sampleWithRequiredData];
        expectedResult = service.addEducationToCollectionIfMissing(educationCollection, ...educationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const education: IEducation = sampleWithRequiredData;
        const education2: IEducation = sampleWithPartialData;
        expectedResult = service.addEducationToCollectionIfMissing([], education, education2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(education);
        expect(expectedResult).toContain(education2);
      });

      it('should accept null and undefined values', () => {
        const education: IEducation = sampleWithRequiredData;
        expectedResult = service.addEducationToCollectionIfMissing([], null, education, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(education);
      });

      it('should return initial array if no Education is added', () => {
        const educationCollection: IEducation[] = [sampleWithRequiredData];
        expectedResult = service.addEducationToCollectionIfMissing(educationCollection, undefined, null);
        expect(expectedResult).toEqual(educationCollection);
      });
    });

    describe('compareEducation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEducation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareEducation(entity1, entity2);
        const compareResult2 = service.compareEducation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareEducation(entity1, entity2);
        const compareResult2 = service.compareEducation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareEducation(entity1, entity2);
        const compareResult2 = service.compareEducation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
