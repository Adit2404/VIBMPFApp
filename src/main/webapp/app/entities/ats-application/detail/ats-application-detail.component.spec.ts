import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AtsApplicationDetailComponent } from './ats-application-detail.component';

describe('AtsApplication Management Detail Component', () => {
  let comp: AtsApplicationDetailComponent;
  let fixture: ComponentFixture<AtsApplicationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsApplicationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ atsApplication: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AtsApplicationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AtsApplicationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load atsApplication on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.atsApplication).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
