import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExperienceFormService } from './experience-form.service';
import { ExperienceService } from '../service/experience.service';
import { IExperience } from '../experience.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

import { ExperienceUpdateComponent } from './experience-update.component';

describe('Experience Management Update Component', () => {
  let comp: ExperienceUpdateComponent;
  let fixture: ComponentFixture<ExperienceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let experienceFormService: ExperienceFormService;
  let experienceService: ExperienceService;
  let candidateService: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExperienceUpdateComponent],
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
      .overrideTemplate(ExperienceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExperienceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    experienceFormService = TestBed.inject(ExperienceFormService);
    experienceService = TestBed.inject(ExperienceService);
    candidateService = TestBed.inject(CandidateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Candidate query and add missing value', () => {
      const experience: IExperience = { id: 'CBA' };
      const candidate: ICandidate = { id: 68908 };
      experience.candidate = candidate;

      const candidateCollection: ICandidate[] = [{ id: 19503 }];
      jest.spyOn(candidateService, 'query').mockReturnValue(of(new HttpResponse({ body: candidateCollection })));
      const additionalCandidates = [candidate];
      const expectedCollection: ICandidate[] = [...additionalCandidates, ...candidateCollection];
      jest.spyOn(candidateService, 'addCandidateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ experience });
      comp.ngOnInit();

      expect(candidateService.query).toHaveBeenCalled();
      expect(candidateService.addCandidateToCollectionIfMissing).toHaveBeenCalledWith(
        candidateCollection,
        ...additionalCandidates.map(expect.objectContaining)
      );
      expect(comp.candidatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const experience: IExperience = { id: 'CBA' };
      const candidate: ICandidate = { id: 37483 };
      experience.candidate = candidate;

      activatedRoute.data = of({ experience });
      comp.ngOnInit();

      expect(comp.candidatesSharedCollection).toContain(candidate);
      expect(comp.experience).toEqual(experience);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExperience>>();
      const experience = { id: 'ABC' };
      jest.spyOn(experienceFormService, 'getExperience').mockReturnValue(experience);
      jest.spyOn(experienceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experience });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: experience }));
      saveSubject.complete();

      // THEN
      expect(experienceFormService.getExperience).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(experienceService.update).toHaveBeenCalledWith(expect.objectContaining(experience));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExperience>>();
      const experience = { id: 'ABC' };
      jest.spyOn(experienceFormService, 'getExperience').mockReturnValue({ id: null });
      jest.spyOn(experienceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experience: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: experience }));
      saveSubject.complete();

      // THEN
      expect(experienceFormService.getExperience).toHaveBeenCalled();
      expect(experienceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IExperience>>();
      const experience = { id: 'ABC' };
      jest.spyOn(experienceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ experience });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(experienceService.update).toHaveBeenCalled();
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
