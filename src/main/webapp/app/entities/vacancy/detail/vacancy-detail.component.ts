import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVacancy } from '../vacancy.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-vacancy-detail',
  templateUrl: './vacancy-detail.component.html',
})
export class VacancyDetailComponent implements OnInit {
  vacancy: IVacancy | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacancy }) => {
      this.vacancy = vacancy;
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
