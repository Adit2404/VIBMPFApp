import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RemarkService } from '../service/remark.service';

import { RemarkComponent } from './remark.component';

describe('Remark Management Component', () => {
  let comp: RemarkComponent;
  let fixture: ComponentFixture<RemarkComponent>;
  let service: RemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'remark', component: RemarkComponent }]), HttpClientTestingModule],
      declarations: [RemarkComponent],
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
      .overrideTemplate(RemarkComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RemarkComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RemarkService);

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
    expect(comp.remarks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to remarkService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRemarkIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRemarkIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
