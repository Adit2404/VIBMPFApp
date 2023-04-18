import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VacancyFormService } from './vacancy-form.service';
import { VacancyService } from '../service/vacancy.service';
import { IVacancy } from '../vacancy.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';

import { VacancyUpdateComponent } from './vacancy-update.component';

describe('Vacancy Management Update Component', () => {
  let comp: VacancyUpdateComponent;
  let fixture: ComponentFixture<VacancyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vacancyFormService: VacancyFormService;
  let vacancyService: VacancyService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VacancyUpdateComponent],
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
      .overrideTemplate(VacancyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacancyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vacancyFormService = TestBed.inject(VacancyFormService);
    vacancyService = TestBed.inject(VacancyService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Company query and add missing value', () => {
      const vacancy: IVacancy = { id: 456 };
      const company: ICompany = { id: 'e08c8b8a-c0a2-4ef7-9f2d-4aad6d525841' };
      vacancy.company = company;

      const companyCollection: ICompany[] = [{ id: '3025dd1f-e85f-4bf1-b8aa-89d189698fd0' }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vacancy });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining)
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const vacancy: IVacancy = { id: 456 };
      const company: ICompany = { id: '4c2700d1-cdda-47c3-b76f-3113b1e1047d' };
      vacancy.company = company;

      activatedRoute.data = of({ vacancy });
      comp.ngOnInit();

      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.vacancy).toEqual(vacancy);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancy>>();
      const vacancy = { id: 123 };
      jest.spyOn(vacancyFormService, 'getVacancy').mockReturnValue(vacancy);
      jest.spyOn(vacancyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacancy }));
      saveSubject.complete();

      // THEN
      expect(vacancyFormService.getVacancy).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vacancyService.update).toHaveBeenCalledWith(expect.objectContaining(vacancy));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancy>>();
      const vacancy = { id: 123 };
      jest.spyOn(vacancyFormService, 'getVacancy').mockReturnValue({ id: null });
      jest.spyOn(vacancyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancy: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vacancy }));
      saveSubject.complete();

      // THEN
      expect(vacancyFormService.getVacancy).toHaveBeenCalled();
      expect(vacancyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVacancy>>();
      const vacancy = { id: 123 };
      jest.spyOn(vacancyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vacancy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vacancyService.update).toHaveBeenCalled();
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
