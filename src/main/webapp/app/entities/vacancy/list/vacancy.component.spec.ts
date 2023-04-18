import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacancyService } from '../service/vacancy.service';

import { VacancyComponent } from './vacancy.component';

describe('Vacancy Management Component', () => {
  let comp: VacancyComponent;
  let fixture: ComponentFixture<VacancyComponent>;
  let service: VacancyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vacancy', component: VacancyComponent }]), HttpClientTestingModule],
      declarations: [VacancyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VacancyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacancyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VacancyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.vacancies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to vacancyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVacancyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVacancyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
