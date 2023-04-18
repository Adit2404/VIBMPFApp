import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICompanyUser } from '../company-user.model';
import { CompanyUserService } from '../service/company-user.service';

@Injectable({ providedIn: 'root' })
export class CompanyUserRoutingResolveService implements Resolve<ICompanyUser | null> {
  constructor(protected service: CompanyUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICompanyUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((companyUser: HttpResponse<ICompanyUser>) => {
          if (companyUser.body) {
            return of(companyUser.body);
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
