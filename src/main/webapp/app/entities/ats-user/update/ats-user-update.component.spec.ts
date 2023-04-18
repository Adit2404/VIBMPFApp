import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AtsUserFormService } from './ats-user-form.service';
import { AtsUserService } from '../service/ats-user.service';
import { IAtsUser } from '../ats-user.model';

import { AtsUserUpdateComponent } from './ats-user-update.component';

describe('AtsUser Management Update Component', () => {
  let comp: AtsUserUpdateComponent;
  let fixture: ComponentFixture<AtsUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let atsUserFormService: AtsUserFormService;
  let atsUserService: AtsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AtsUserUpdateComponent],
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
      .overrideTemplate(AtsUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AtsUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    atsUserFormService = TestBed.inject(AtsUserFormService);
    atsUserService = TestBed.inject(AtsUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const atsUser: IAtsUser = { id: 456 };

      activatedRoute.data = of({ atsUser });
      comp.ngOnInit();

      expect(comp.atsUser).toEqual(atsUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsUser>>();
      const atsUser = { id: 123 };
      jest.spyOn(atsUserFormService, 'getAtsUser').mockReturnValue(atsUser);
      jest.spyOn(atsUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atsUser }));
      saveSubject.complete();

      // THEN
      expect(atsUserFormService.getAtsUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(atsUserService.update).toHaveBeenCalledWith(expect.objectContaining(atsUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsUser>>();
      const atsUser = { id: 123 };
      jest.spyOn(atsUserFormService, 'getAtsUser').mockReturnValue({ id: null });
      jest.spyOn(atsUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atsUser }));
      saveSubject.complete();

      // THEN
      expect(atsUserFormService.getAtsUser).toHaveBeenCalled();
      expect(atsUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtsUser>>();
      const atsUser = { id: 123 };
      jest.spyOn(atsUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atsUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(atsUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
