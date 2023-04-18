import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompanyUserFormService } from './company-user-form.service';
import { CompanyUserService } from '../service/company-user.service';
import { ICompanyUser } from '../company-user.model';
import { IAtsUser } from 'app/entities/ats-user/ats-user.model';
import { AtsUserService } from 'app/entities/ats-user/service/ats-user.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { CompanyUserUpdateComponent } from './company-user-update.component';

describe('CompanyUser Management Update Component', () => {
  let comp: CompanyUserUpdateComponent;
  let fixture: ComponentFixture<CompanyUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let companyUserFormService: CompanyUserFormService;
  let companyUserService: CompanyUserService;
  let atsUserService: AtsUserService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompanyUserUpdateComponent],
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
      .overrideTemplate(CompanyUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    companyUserFormService = TestBed.inject(CompanyUserFormService);
    companyUserService = TestBed.inject(CompanyUserService);
    atsUserService = TestBed.inject(AtsUserService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call atsUser query and add missing value', () => {
      const companyUser: ICompanyUser = { id: 456 };
      const atsUser: IAtsUser = { id: 9544 };
      companyUser.atsUser = atsUser;

      const atsUserCollection: IAtsUser[] = [{ id: 80023 }];
      jest.spyOn(atsUserService, 'query').mockReturnValue(of(new HttpResponse({ body: atsUserCollection })));
      const expectedCollection: IAtsUser[] = [atsUser, ...atsUserCollection];
      jest.spyOn(atsUserService, 'addAtsUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ companyUser });
      comp.ngOnInit();

      expect(atsUserService.query).toHaveBeenCalled();
      expect(atsUserService.addAtsUserToCollectionIfMissing).toHaveBeenCalledWith(atsUserCollection, atsUser);
      expect(comp.atsUsersCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const companyUser: ICompanyUser = { id: 456 };
      const company: ICompany = { id: '8b4f9917-37bd-47f8-99b1-46d21d0ef902' };
      companyUser.company = company;

      const companyCollection: ICompany[] = [{ id: '63750761-8e15-4221-91c8-389ee230a5d5' }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ companyUser });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const companyUser: ICompanyUser = { id: 456 };
      const atsUser: IAtsUser = { id: 68642 };
      companyUser.atsUser = atsUser;
      const company: ICompany = { id: 'bf23400b-cc3a-4872-b49f-ef61106a9652' };
      companyUser.company = company;

      activatedRoute.data = of({ companyUser });
      comp.ngOnInit();

      expect(comp.atsUsersCollection).toContain(atsUser);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.companyUser).toEqual(companyUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyUser>>();
      const companyUser = { id: 123 };
      jest.spyOn(companyUserFormService, 'getCompanyUser').mockReturnValue(companyUser);
      jest.spyOn(companyUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyUser }));
      saveSubject.complete();

      // THEN
      expect(companyUserFormService.getCompanyUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(companyUserService.update).toHaveBeenCalledWith(expect.objectContaining(companyUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyUser>>();
      const companyUser = { id: 123 };
      jest.spyOn(companyUserFormService, 'getCompanyUser').mockReturnValue({ id: null });
      jest.spyOn(companyUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyUser }));
      saveSubject.complete();

      // THEN
      expect(companyUserFormService.getCompanyUser).toHaveBeenCalled();
      expect(companyUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyUser>>();
      const companyUser = { id: 123 };
      jest.spyOn(companyUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(companyUserService.update).toHaveBeenCalled();
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

    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
