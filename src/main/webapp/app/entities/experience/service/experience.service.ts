import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExperience, NewExperience } from '../experience.model';

export type PartialUpdateExperience = Partial<IExperience> & Pick<IExperience, 'id'>;

type RestOf<T extends IExperience | NewExperience> = Omit<T, 'sdate' | 'edate'> & {
  sdate?: string | null;
  edate?: string | null;
};

export type RestExperience = RestOf<IExperience>;

export type NewRestExperience = RestOf<NewExperience>;

export type PartialUpdateRestExperience = RestOf<PartialUpdateExperience>;

export type EntityResponseType = HttpResponse<IExperience>;
export type EntityArrayResponseType = HttpResponse<IExperience[]>;

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/experiences');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(experience: NewExperience): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experience);
    return this.http
      .post<RestExperience>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(experience: IExperience): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experience);
    return this.http
      .put<RestExperience>(`${this.resourceUrl}/${this.getExperienceIdentifier(experience)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(experience: PartialUpdateExperience): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(experience);
    return this.http
      .patch<RestExperience>(`${this.resourceUrl}/${this.getExperienceIdentifier(experience)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestExperience>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExperience[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExperienceIdentifier(experience: Pick<IExperience, 'id'>): string {
    return experience.id;
  }

  compareExperience(o1: Pick<IExperience, 'id'> | null, o2: Pick<IExperience, 'id'> | null): boolean {
    return o1 && o2 ? this.getExperienceIdentifier(o1) === this.getExperienceIdentifier(o2) : o1 === o2;
  }

  addExperienceToCollectionIfMissing<Type extends Pick<IExperience, 'id'>>(
    experienceCollection: Type[],
    ...experiencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const experiences: Type[] = experiencesToCheck.filter(isPresent);
    if (experiences.length > 0) {
      const experienceCollectionIdentifiers = experienceCollection.map(experienceItem => this.getExperienceIdentifier(experienceItem)!);
      const experiencesToAdd = experiences.filter(experienceItem => {
        const experienceIdentifier = this.getExperienceIdentifier(experienceItem);
        if (experienceCollectionIdentifiers.includes(experienceIdentifier)) {
          return false;
        }
        experienceCollectionIdentifiers.push(experienceIdentifier);
        return true;
      });
      return [...experiencesToAdd, ...experienceCollection];
    }
    return experienceCollection;
  }

  protected convertDateFromClient<T extends IExperience | NewExperience | PartialUpdateExperience>(experience: T): RestOf<T> {
    return {
      ...experience,
      sdate: experience.sdate?.format(DATE_FORMAT) ?? null,
      edate: experience.edate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restExperience: RestExperience): IExperience {
    return {
      ...restExperience,
      sdate: restExperience.sdate ? dayjs(restExperience.sdate) : undefined,
      edate: restExperience.edate ? dayjs(restExperience.edate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExperience>): HttpResponse<IExperience> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExperience[]>): HttpResponse<IExperience[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
