import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAtsApplication } from '../ats-application.model';
import { AtsApplicationService } from '../service/ats-application.service';

@Injectable({ providedIn: 'root' })
export class AtsApplicationRoutingResolveService implements Resolve<IAtsApplication | null> {
  constructor(protected service: AtsApplicationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAtsApplication | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((atsApplication: HttpResponse<IAtsApplication>) => {
          if (atsApplication.body) {
            return of(atsApplication.body);
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
