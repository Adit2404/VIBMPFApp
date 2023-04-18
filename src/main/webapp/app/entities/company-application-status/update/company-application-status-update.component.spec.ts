import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompanyApplicationStatusFormService } from './company-application-status-form.service';
import { CompanyApplicationStatusService } from '../service/company-application-status.service';
import { ICompanyApplicationStatus } from '../company-application-status.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { CompanyApplicationStatusUpdateComponent } from './company-application-status-update.component';

describe('CompanyApplicationStatus Management Update Component', () => {
  let comp: CompanyApplicationStatusUpdateComponent;
  let fixture: ComponentFixture<CompanyApplicationStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let companyApplicationStatusFormService: CompanyApplicationStatusFormService;
  let companyApplicationStatusService: CompanyApplicationStatusService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompanyApplicationStatusUpdateComponent],
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
      .overrideTemplate(CompanyApplicationStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyApplicationStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    companyApplicationStatusFormService = TestBed.inject(CompanyApplicationStatusFormService);
    companyApplicationStatusService = TestBed.inject(CompanyApplicationStatusService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Company query and add missing value', () => {
      const companyApplicationStatus: ICompanyApplicationStatus = { id: 456 };
      const company: ICompany = { id: 'f257736b-9031-42dd-9ade-b6a1e0ce3638' };
      companyApplicationStatus.company = company;

      const companyCollection: ICompany[] = [{ id: '169659d1-713e-4dc8-823a-f5db568bbb36' }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ companyApplicationStatus });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const companyApplicationStatus: ICompanyApplicationStatus = { id: 456 };
      const company: ICompany = { id: 'b05158c5-0122-4244-8c98-b7575961005f' };
      companyApplicationStatus.company = company;

      activatedRoute.data = of({ companyApplicationStatus });
      comp.ngOnInit();

      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.companyApplicationStatus).toEqual(companyApplicationStatus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyApplicationStatus>>();
      const companyApplicationStatus = { id: 123 };
      jest.spyOn(companyApplicationStatusFormService, 'getCompanyApplicationStatus').mockReturnValue(companyApplicationStatus);
      jest.spyOn(companyApplicationStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyApplicationStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyApplicationStatus }));
      saveSubject.complete();

      // THEN
      expect(companyApplicationStatusFormService.getCompanyApplicationStatus).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(companyApplicationStatusService.update).toHaveBeenCalledWith(expect.objectContaining(companyApplicationStatus));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyApplicationStatus>>();
      const companyApplicationStatus = { id: 123 };
      jest.spyOn(companyApplicationStatusFormService, 'getCompanyApplicationStatus').mockReturnValue({ id: null });
      jest.spyOn(companyApplicationStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyApplicationStatus: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: companyApplicationStatus }));
      saveSubject.complete();

      // THEN
      expect(companyApplicationStatusFormService.getCompanyApplicationStatus).toHaveBeenCalled();
      expect(companyApplicationStatusService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompanyApplicationStatus>>();
      const companyApplicationStatus = { id: 123 };
      jest.spyOn(companyApplicationStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ companyApplicationStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(companyApplicationStatusService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
