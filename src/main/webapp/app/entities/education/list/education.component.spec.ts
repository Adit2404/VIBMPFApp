import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EducationService } from '../service/education.service';

import { EducationComponent } from './education.component';

describe('Education Management Component', () => {
  let comp: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
  let service: EducationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'education', component: EducationComponent }]), HttpClientTestingModule],
      declarations: [EducationComponent],
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
      .overrideTemplate(EducationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EducationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
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
    expect(comp.educations?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  describe('trackId', () => {
    it('Should forward to educationService', () => {
      const entity = { id: 'ABC' };
      jest.spyOn(service, 'getEducationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEducationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
