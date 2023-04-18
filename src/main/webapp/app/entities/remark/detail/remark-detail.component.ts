import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRemark } from '../remark.model';

@Component({
  selector: 'jhi-remark-detail',
  templateUrl: './remark-detail.component.html',
})
export class RemarkDetailComponent implements OnInit {
  remark: IRemark | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ remark }) => {
      this.remark = remark;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
