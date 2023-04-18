import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompanyApplicationStatusDetailComponent } from './company-application-status-detail.component';

describe('CompanyApplicationStatus Management Detail Component', () => {
  let comp: CompanyApplicationStatusDetailComponent;
  let fixture: ComponentFixture<CompanyApplicationStatusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyApplicationStatusDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ companyApplicationStatus: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompanyApplicationStatusDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompanyApplicationStatusDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load companyApplicationStatus on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.companyApplicationStatus).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
