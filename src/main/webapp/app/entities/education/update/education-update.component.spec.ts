import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EducationFormService } from './education-form.service';
import { EducationService } from '../service/education.service';
import { IEducation } from '../education.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

import { EducationUpdateComponent } from './education-update.component';

describe('Education Management Update Component', () => {
  let comp: EducationUpdateComponent;
  let fixture: ComponentFixture<EducationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let educationFormService: EducationFormService;
  let educationService: EducationService;
  let candidateService: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EducationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EducationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    educationFormService = TestBed.inject(EducationFormService);
    educationService = TestBed.inject(EducationService);
    candidateService = TestBed.inject(CandidateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Candidate query and add missing value', () => {
      const education: IEducation = { id: 'CBA' };
      const candidate: ICandidate = { id: 51154 };
      education.candidate = candidate;

      const candidateCollection: ICandidate[] = [{ id: 84116 }];
      jest.spyOn(candidateService, 'query').mockReturnValue(of(new HttpResponse({ body: candidateCollection })));
      const additionalCandidates = [candidate];
      const expectedCollection: ICandidate[] = [...additionalCandidates, ...candidateCollection];
      jest.spyOn(candidateService, 'addCandidateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ education });
      comp.ngOnInit();

      expect(candidateService.query).toHaveBeenCalled();
      expect(candidateService.addCandidateToCollectionIfMissing).toHaveBeenCalledWith(
        candidateCollection,
        ...additionalCandidates.map(expect.objectContaining)
      );
      expect(comp.candidatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const education: IEducation = { id: 'CBA' };
      const candidate: ICandidate = { id: 69784 };
      education.candidate = candidate;

      activatedRoute.data = of({ education });
      comp.ngOnInit();

      expect(comp.candidatesSharedCollection).toContain(candidate);
      expect(comp.education).toEqual(education);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducation>>();
      const education = { id: 'ABC' };
      jest.spyOn(educationFormService, 'getEducation').mockReturnValue(education);
      jest.spyOn(educationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ education });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: education }));
      saveSubject.complete();

      // THEN
      expect(educationFormService.getEducation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(educationService.update).toHaveBeenCalledWith(expect.objectContaining(education));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducation>>();
      const education = { id: 'ABC' };
      jest.spyOn(educationFormService, 'getEducation').mockReturnValue({ id: null });
      jest.spyOn(educationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ education: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: education }));
      saveSubject.complete();

      // THEN
      expect(educationFormService.getEducation).toHaveBeenCalled();
      expect(educationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEducation>>();
      const education = { id: 'ABC' };
      jest.spyOn(educationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ education });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(educationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCandidate', () => {
      it('Should forward to candidateService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(candidateService, 'compareCandidate');
        comp.compareCandidate(entity, entity2);
        expect(candidateService.compareCandidate).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
