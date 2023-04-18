import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompanyUserDetailComponent } from './company-user-detail.component';

describe('CompanyUser Management Detail Component', () => {
  let comp: CompanyUserDetailComponent;
  let fixture: ComponentFixture<CompanyUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ companyUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompanyUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompanyUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load companyUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.companyUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
