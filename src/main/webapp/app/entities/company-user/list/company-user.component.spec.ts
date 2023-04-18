import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompanyUserService } from '../service/company-user.service';

import { CompanyUserComponent } from './company-user.component';

describe('CompanyUser Management Component', () => {
  let comp: CompanyUserComponent;
  let fixture: ComponentFixture<CompanyUserComponent>;
  let service: CompanyUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'company-user', component: CompanyUserComponent }]), HttpClientTestingModule],
      declarations: [CompanyUserComponent],
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
      .overrideTemplate(CompanyUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompanyUserService);

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
    expect(comp.companyUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to companyUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompanyUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompanyUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
