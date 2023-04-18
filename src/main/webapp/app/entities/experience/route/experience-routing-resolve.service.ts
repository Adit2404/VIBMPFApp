import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExperience } from '../experience.model';
import { ExperienceService } from '../service/experience.service';

@Injectable({ providedIn: 'root' })
export class ExperienceRoutingResolveService implements Resolve<IExperience | null> {
  constructor(protected service: ExperienceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExperience | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((experience: HttpResponse<IExperience>) => {
          if (experience.body) {
            return of(experience.body);
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
