import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAtsUser } from '../ats-user.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-ats-user-detail',
  templateUrl: './ats-user-detail.component.html',
})
export class AtsUserDetailComponent implements OnInit {
  atsUser: IAtsUser | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ atsUser }) => {
      this.atsUser = atsUser;
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
