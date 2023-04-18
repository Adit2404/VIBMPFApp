import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RemarkFormService } from './remark-form.service';
import { RemarkService } from '../service/remark.service';
import { IRemark } from '../remark.model';
import { IAtsApplication } from 'app/entities/ats-application/ats-application.model';
import { AtsApplicationService } from 'app/entities/ats-application/service/ats-application.service';
import { ICompanyUser } from 'app/entities/company-user/company-user.model';
import { CompanyUserService } from 'app/entities/company-user/service/company-user.service';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { CandidateService } from 'app/entities/candidate/service/candidate.service';

import { RemarkUpdateComponent } from './remark-update.component';

describe('Remark Management Update Component', () => {
  let comp: RemarkUpdateComponent;
  let fixture: ComponentFixture<RemarkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let remarkFormService: RemarkFormService;
  let remarkService: RemarkService;
  let atsApplicationService: AtsApplicationService;
  let companyUserService: CompanyUserService;
  let candidateService: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RemarkUpdateComponent],
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
      .overrideTemplate(RemarkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RemarkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    remarkFormService = TestBed.inject(RemarkFormService);
    remarkService = TestBed.inject(RemarkService);
    atsApplicationService = TestBed.inject(AtsApplicationService);
    companyUserService = TestBed.inject(CompanyUserService);
    candidateService = TestBed.inject(CandidateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AtsApplication query and add missing value', () => {
      const remark: IRemark = { id: 456 };
      const atsApplication: IAtsApplication = { id: 91688 };
      remark.atsApplication = atsApplication;

      const atsApplicationCollection: IAtsApplication[] = [{ id: 49124 }];
      jest.spyOn(atsApplicationService, 'query').mockReturnValue(of(new HttpResponse({ body: atsApplicationCollection })));
      const additionalAtsApplications = [atsApplication];
      const expectedCollection: IAtsApplication[] = [...additionalAtsApplications, ...atsApplicationCollection];
      jest.spyOn(atsApplicationService, 'addAtsApplicationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      expect(atsApplicationService.query).toHaveBeenCalled();
      expect(atsApplicationService.addAtsApplicationToCollectionIfMissing).toHaveBeenCalledWith(
        atsApplicationCollection,
        ...additionalAtsApplications.map(expect.objectContaining)
      );
      expect(comp.atsApplicationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CompanyUser query and add missing value', () => {
      const remark: IRemark = { id: 456 };
      const companyUser: ICompanyUser = { id: 34634 };
      remark.companyUser = companyUser;

      const companyUserCollection: ICompanyUser[] = [{ id: 58964 }];
      jest.spyOn(companyUserService, 'query').mockReturnValue(of(new HttpResponse({ body: companyUserCollection })));
      const additionalCompanyUsers = [companyUser];
      const expectedCollection: ICompanyUser[] = [...additionalCompanyUsers, ...companyUserCollection];
      jest.spyOn(companyUserService, 'addCompanyUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      expect(companyUserService.query).toHaveBeenCalled();
      expect(companyUserService.addCompanyUserToCollectionIfMissing).toHaveBeenCalledWith(
        companyUserCollection,
        ...additionalCompanyUsers.map(expect.objectContaining)
      );
      expect(comp.companyUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Candidate query and add missing value', () => {
      const remark: IRemark = { id: 456 };
      const candidate: ICandidate = { id: 24000 };
      remark.candidate = candidate;

      const candidateCollection: ICandidate[] = [{ id: 38363 }];
      jest.spyOn(candidateService, 'query').mockReturnValue(of(new HttpResponse({ body: candidateCollection })));
      const additionalCandidates = [candidate];
      const expectedCollection: ICandidate[] = [...additionalCandidates, ...candidateCollection];
      jest.spyOn(candidateService, 'addCandidateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      expect(candidateService.query).toHaveBeenCalled();
      expect(candidateService.addCandidateToCollectionIfMissing).toHaveBeenCalledWith(
        candidateCollection,
        ...additionalCandidates.map(expect.objectContaining)
      );
      expect(comp.candidatesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const remark: IRemark = { id: 456 };
      const atsApplication: IAtsApplication = { id: 765 };
      remark.atsApplication = atsApplication;
      const companyUser: ICompanyUser = { id: 52694 };
      remark.companyUser = companyUser;
      const candidate: ICandidate = { id: 23637 };
      remark.candidate = candidate;

      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      expect(comp.atsApplicationsSharedCollection).toContain(atsApplication);
      expect(comp.companyUsersSharedCollection).toContain(companyUser);
      expect(comp.candidatesSharedCollection).toContain(candidate);
      expect(comp.remark).toEqual(remark);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRemark>>();
      const remark = { id: 123 };
      jest.spyOn(remarkFormService, 'getRemark').mockReturnValue(remark);
      jest.spyOn(remarkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: remark }));
      saveSubject.complete();

      // THEN
      expect(remarkFormService.getRemark).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(remarkService.update).toHaveBeenCalledWith(expect.objectContaining(remark));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRemark>>();
      const remark = { id: 123 };
      jest.spyOn(remarkFormService, 'getRemark').mockReturnValue({ id: null });
      jest.spyOn(remarkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ remark: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: remark }));
      saveSubject.complete();

      // THEN
      expect(remarkFormService.getRemark).toHaveBeenCalled();
      expect(remarkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRemark>>();
      const remark = { id: 123 };
      jest.spyOn(remarkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ remark });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(remarkService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAtsApplication', () => {
      it('Should forward to atsApplicationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(atsApplicationService, 'compareAtsApplication');
        comp.compareAtsApplication(entity, entity2);
        expect(atsApplicationService.compareAtsApplication).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompanyUser', () => {
      it('Should forward to companyUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(companyUserService, 'compareCompanyUser');
        comp.compareCompanyUser(entity, entity2);
        expect(companyUserService.compareCompanyUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
