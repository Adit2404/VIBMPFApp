import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AtsApplicationFormService } from './ats-application-form.service';
import { AtsApplicationService } from '../service/ats-application.service';
import { IAtsApplication } from '../ats-application.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';
import { IVacancy } from 'app/entities/vacancy/vacancy.model';
import { VacancyService } from 'app/entities/vacancy/service/vacancy.service';
import { ICompanyApplicationStatus } from 'app/entities/company-application-status/company-application-status.model';
import { CompanyApplicationStatusService } from 'app/entities/company-application-status/service/company-application-status.service';

import { AtsApplicationUpdateComponent } from './ats-application-update.component';

describe('AtsApplication Management Update Component', () => {
  let comp: AtsApplicationUpdateComponent;
  let fixture: ComponentFixture<AtsApplicationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let atsApplicationFormService: AtsApplicationFormService;
  let atsApplicationService: AtsApplicationService;
  let candidateService: CandidateService;
  let vacancyService: VacancyService;
  let companyApplicationStatusService: CompanyApplicationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AtsApplicationUpdateComponent],
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
      .overrideTemplate(AtsApplicationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AtsApplicationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    atsApplicationFormService = TestBed.inject(AtsApplicationFormService);
    atsApplicationService = TestBed.inject(AtsApplicationService);
    candidateService = TestBed.inject(CandidateService);
    vacancyService = TestBed.inject(VacancyService);
    companyApplicationStatusService = TestBed.inject(CompanyApplicationStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Candidate query and add missing value', () => {
      const atsApplication: IAtsApplication = { id: 456 };
      const candidate: ICandidate = { id: 95932 };
      atsApplication.candidate = candidate;

      const candidateCollection: ICandidate[] = [{ id: 89584 }];
      jest.spyOn(candidateService, 'query').mockReturnValue(of(new HttpResponse({ body: candidateCollection })));
      const additionalCandidates = [candidate];
      const expectedCollection: ICandidate[] = [...additionalCandidates, ...candidateCollection];
      jest.spyOn(candidateService, 'addCandidateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      expect(candidateService.query).toHaveBeenCalled();
      expect(candidateService.addCandidateToCollectionIfMissing).toHaveBeenCalledWith(
        candidateCollection,
        ...additionalCandidates.map(expect.objectContaining)
      );
      expect(comp.candidatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Vacancy query and add missing value', () => {
      const atsApplication: IAtsApplication = { id: 456 };
      const vacancy: IVacancy = { id: 28178 };
      atsApplication.vacancy = vacancy;

      const vacancyCollection: IVacancy[] = [{ id: 61697 }];
      jest.spyOn(vacancyService, 'query').mockReturnValue(of(new HttpResponse({ body: vacancyCollection })));
      const additionalVacancies = [vacancy];
      const expectedCollection: IVacancy[] = [...additionalVacancies, ...vacancyCollection];
      jest.spyOn(vacancyService, 'addVacancyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      expect(vacancyService.query).toHaveBeenCalled();
      expect(vacancyService.addVacancyToCollectionIfMissing).toHaveBeenCalledWith(
        vacancyCollection,
        ...additionalVacancies.map(expect.objectContaining)
      );
      expect(comp.vacanciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CompanyApplicationStatus query and add missing value', () => {
      const atsApplication: IAtsApplication = { id: 456 };
      const companyApplicationStatus: ICompanyApplicationStatus = { id: 12276 };
      atsApplication.companyApplicationStatus = companyApplicationStatus;

      const companyApplicationStatusCollection: ICompanyApplicationStatus[] = [{ id: 85056 }];
      jest
        .spyOn(companyApplicationStatusService, 'query')
        .mockReturnValue(of(new HttpResponse({ body: companyApplicationStatusCollection })));
      const additionalCompanyApplicationStatuses = [companyApplicationStatus];
      const expectedCollection: ICompanyApplicationStatus[] = [
        ...additionalCompanyApplicationStatuses,
        ...companyApplicationStatusCollection,
      ];
      jest.spyOn(companyApplicationStatusService, 'addCompanyApplicationStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      expect(companyApplicationStatusService.query).toHaveBeenCalled();
      expect(companyApplicationStatusService.addCompanyApplicationStatusToCollectionIfMissing).toHaveBeenCalledWith(
        companyApplicationStatusCollection,
        ...additionalCompanyApplicationStatuses.map(expect.objectContaining)
      );
      expect(comp.companyApplicationStatusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const atsApplication: IAtsApplication = { id: 456 };
      const candidate: ICandidate = { id: 7832 };
      atsApplication.candidate = candidate;
      const vacancy: IVacancy = { id: 22721 };
      atsApplication.vacancy = vacancy;
      const companyApplicationStatus: ICompanyApplicationStatus = { id: 10089 };
      atsApplication.companyApplicationStatus = companyApplicationStatus;

      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      expect(comp.candidatesSharedCollection).toContain(candidate);
      expect(comp.vacanciesSharedCollection).toContain(vacancy);
      expect(comp.companyApplicationStatusesSharedCollection).toContain(companyApplicationStatus);
      expect(comp.atsApplication).toEqual(atsApplication);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsApplication>>();
      const atsApplication = { id: 123 };
      jest.spyOn(atsApplicationFormService, 'getAtsApplication').mockReturnValue(atsApplication);
      jest.spyOn(atsApplicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atsApplication }));
      saveSubject.complete();

      // THEN
      expect(atsApplicationFormService.getAtsApplication).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(atsApplicationService.update).toHaveBeenCalledWith(expect.objectContaining(atsApplication));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsApplication>>();
      const atsApplication = { id: 123 };
      jest.spyOn(atsApplicationFormService, 'getAtsApplication').mockReturnValue({ id: null });
      jest.spyOn(atsApplicationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsApplication: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atsApplication }));
      saveSubject.complete();

      // THEN
      expect(atsApplicationFormService.getAtsApplication).toHaveBeenCalled();
      expect(atsApplicationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsApplication>>();
      const atsApplication = { id: 123 };
      jest.spyOn(atsApplicationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsApplication });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(atsApplicationService.update).toHaveBeenCalled();
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

    describe('compareVacancy', () => {
      it('Should forward to vacancyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vacancyService, 'compareVacancy');
        comp.compareVacancy(entity, entity2);
        expect(vacancyService.compareVacancy).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompanyApplicationStatus', () => {
      it('Should forward to companyApplicationStatusService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyApplicationStatusService, 'compareCompanyApplicationStatus');
        comp.compareCompanyApplicationStatus(entity, entity2);
        expect(companyApplicationStatusService.compareCompanyApplicationStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
