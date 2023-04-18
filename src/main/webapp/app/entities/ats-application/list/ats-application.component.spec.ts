import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AtsApplicationService } from '../service/ats-application.service';

import { AtsApplicationComponent } from './ats-application.component';

describe('AtsApplication Management Component', () => {
  let comp: AtsApplicationComponent;
  let fixture: ComponentFixture<AtsApplicationComponent>;
  let service: AtsApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'ats-application', component: AtsApplicationComponent }]), HttpClientTestingModule],
      declarations: [AtsApplicationComponent],
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
      .overrideTemplate(AtsApplicationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AtsApplicationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AtsApplicationService);

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
    expect(comp.atsApplications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to atsApplicationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAtsApplicationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAtsApplicationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
