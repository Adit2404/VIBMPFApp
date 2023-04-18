import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompanyApplicationStatus } from '../company-application-status.model';

@Component({
  selector: 'jhi-company-application-status-detail',
  templateUrl: './company-application-status-detail.component.html',
})
export class CompanyApplicationStatusDetailComponent implements OnInit {
  companyApplicationStatus: ICompanyApplicationStatus | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyApplicationStatus }) => {
      this.companyApplicationStatus = companyApplicationStatus;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
