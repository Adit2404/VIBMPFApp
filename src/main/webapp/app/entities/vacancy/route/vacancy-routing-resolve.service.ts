import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVacancy } from '../vacancy.model';
import { VacancyService } from '../service/vacancy.service';

@Injectable({ providedIn: 'root' })
export class VacancyRoutingResolveService implements Resolve<IVacancy | null> {
  constructor(protected service: VacancyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVacancy | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vacancy: HttpResponse<IVacancy>) => {
          if (vacancy.body) {
            return of(vacancy.body);
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
