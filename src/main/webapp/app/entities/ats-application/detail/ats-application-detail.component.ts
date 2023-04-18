import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAtsApplication } from '../ats-application.model';

@Component({
  selector: 'jhi-ats-application-detail',
  templateUrl: './ats-application-detail.component.html',
})
export class AtsApplicationDetailComponent implements OnInit {
  atsApplication: IAtsApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atsApplication }) => {
      this.atsApplication = atsApplication;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
