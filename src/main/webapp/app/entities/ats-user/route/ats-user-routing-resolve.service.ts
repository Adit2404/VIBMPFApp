import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAtsUser } from '../ats-user.model';
import { AtsUserService } from '../service/ats-user.service';

@Injectable({ providedIn: 'root' })
export class AtsUserRoutingResolveService implements Resolve<IAtsUser | null> {
  constructor(protected service: AtsUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAtsUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((atsUser: HttpResponse<IAtsUser>) => {
          if (atsUser.body) {
            return of(atsUser.body);
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
