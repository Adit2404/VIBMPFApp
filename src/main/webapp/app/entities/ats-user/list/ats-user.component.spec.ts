import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AtsUserService } from '../service/ats-user.service';

import { AtsUserComponent } from './ats-user.component';

describe('AtsUser Management Component', () => {
  let comp: AtsUserComponent;
  let fixture: ComponentFixture<AtsUserComponent>;
  let service: AtsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'ats-user', component: AtsUserComponent }]), HttpClientTestingModule],
      declarations: [AtsUserComponent],
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
      .overrideTemplate(AtsUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AtsUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AtsUserService);

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
    expect(comp.atsUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to atsUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAtsUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAtsUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
