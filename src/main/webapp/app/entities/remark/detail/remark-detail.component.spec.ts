import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RemarkDetailComponent } from './remark-detail.component';

describe('Remark Management Detail Component', () => {
  let comp: RemarkDetailComponent;
  let fixture: ComponentFixture<RemarkDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemarkDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ remark: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RemarkDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RemarkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load remark on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.remark).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
