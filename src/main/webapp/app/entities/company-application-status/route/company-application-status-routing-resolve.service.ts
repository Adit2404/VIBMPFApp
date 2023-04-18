import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompanyApplicationStatus } from '../company-application-status.model';
import { CompanyApplicationStatusService } from '../service/company-application-status.service';

@Injectable({ providedIn: 'root' })
export class CompanyApplicationStatusRoutingResolveService implements Resolve<ICompanyApplicationStatus | null> {
  constructor(protected service: CompanyApplicationStatusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompanyApplicationStatus | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((companyApplicationStatus: HttpResponse<ICompanyApplicationStatus>) => {
          if (companyApplicationStatus.body) {
            return of(companyApplicationStatus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
