import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CandidateFormService } from './candidate-form.service';
import { CandidateService } from '../service/candidate.service';
import { ICandidate } from '../candidate.model';
import { IAtsUser } from 'app/entities/ats-user/ats-user.model';
import { AtsUserService } from 'app/entities/ats-user/service/ats-user.service';

import { CandidateUpdateComponent } from './candidate-update.component';

describe('Candidate Management Update Component', () => {
  let comp: CandidateUpdateComponent;
  let fixture: ComponentFixture<CandidateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let candidateFormService: CandidateFormService;
  let candidateService: CandidateService;
  let atsUserService: AtsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CandidateUpdateComponent],
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
      .overrideTemplate(CandidateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CandidateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    candidateFormService = TestBed.inject(CandidateFormService);
    candidateService = TestBed.inject(CandidateService);
    atsUserService = TestBed.inject(AtsUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call atsUser query and add missing value', () => {
      const candidate: ICandidate = { id: 456 };
      const atsUser: IAtsUser = { id: 46466 };
      candidate.atsUser = atsUser;

      const atsUserCollection: IAtsUser[] = [{ id: 64875 }];
      jest.spyOn(atsUserService, 'query').mockReturnValue(of(new HttpResponse({ body: atsUserCollection })));
      const expectedCollection: IAtsUser[] = [atsUser, ...atsUserCollection];
      jest.spyOn(atsUserService, 'addAtsUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(atsUserService.query).toHaveBeenCalled();
      expect(atsUserService.addAtsUserToCollectionIfMissing).toHaveBeenCalledWith(atsUserCollection, atsUser);
      expect(comp.atsUsersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const candidate: ICandidate = { id: 456 };
      const atsUser: IAtsUser = { id: 84864 };
      candidate.atsUser = atsUser;

      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      expect(comp.atsUsersCollection).toContain(atsUser);
      expect(comp.candidate).toEqual(candidate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidate>>();
      const candidate = { id: 123 };
      jest.spyOn(candidateFormService, 'getCandidate').mockReturnValue(candidate);
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(candidateFormService.getCandidate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(candidateService.update).toHaveBeenCalledWith(expect.objectContaining(candidate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidate>>();
      const candidate = { id: 123 };
      jest.spyOn(candidateFormService, 'getCandidate').mockReturnValue({ id: null });
      jest.spyOn(candidateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: candidate }));
      saveSubject.complete();

      // THEN
      expect(candidateFormService.getCandidate).toHaveBeenCalled();
      expect(candidateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICandidate>>();
      const candidate = { id: 123 };
      jest.spyOn(candidateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ candidate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(candidateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAtsUser', () => {
      it('Should forward to atsUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(atsUserService, 'compareAtsUser');
        comp.compareAtsUser(entity, entity2);
        expect(atsUserService.compareAtsUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
