import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICompany } from '../company.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-company-detail',
  templateUrl: './company-detail.component.html',
})
export class CompanyDetailComponent implements OnInit {
  company: ICompany | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ company }) => {
      this.company = company;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
