import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRemark } from '../remark.model';
import { RemarkService } from '../service/remark.service';

@Injectable({ providedIn: 'root' })
export class RemarkRoutingResolveService implements Resolve<IRemark | null> {
  constructor(protected service: RemarkService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRemark | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((remark: HttpResponse<IRemark>) => {
          if (remark.body) {
            return of(remark.body);
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
