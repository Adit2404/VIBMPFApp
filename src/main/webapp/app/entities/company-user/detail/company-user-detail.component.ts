import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompanyUser } from '../company-user.model';

@Component({
  selector: 'jhi-company-user-detail',
  templateUrl: './company-user-detail.component.html',
})
export class CompanyUserDetailComponent implements OnInit {
  companyUser: ICompanyUser | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ companyUser }) => {
      this.companyUser = companyUser;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
