import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacancy, NewVacancy } from '../vacancy.model';

export type PartialUpdateVacancy = Partial<IVacancy> & Pick<IVacancy, 'id'>;

type RestOf<T extends IVacancy | NewVacancy> = Omit<T, 'dateOfPosting'> & {
  dateOfPosting?: string | null;
};

export type RestVacancy = RestOf<IVacancy>;

export type NewRestVacancy = RestOf<NewVacancy>;

export type PartialUpdateRestVacancy = RestOf<PartialUpdateVacancy>;

export type EntityResponseType = HttpResponse<IVacancy>;
export type EntityArrayResponseType = HttpResponse<IVacancy[]>;

@Injectable({ providedIn: 'root' })
export class VacancyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacancies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vacancy: NewVacancy): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancy);
    return this.http
      .post<RestVacancy>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacancy: IVacancy): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancy);
    return this.http
      .put<RestVacancy>(`${this.resourceUrl}/${this.getVacancyIdentifier(vacancy)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacancy: PartialUpdateVacancy): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancy);
    return this.http
      .patch<RestVacancy>(`${this.resourceUrl}/${this.getVacancyIdentifier(vacancy)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacancy>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacancy[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacancyIdentifier(vacancy: Pick<IVacancy, 'id'>): number {
    return vacancy.id;
  }

  compareVacancy(o1: Pick<IVacancy, 'id'> | null, o2: Pick<IVacancy, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacancyIdentifier(o1) === this.getVacancyIdentifier(o2) : o1 === o2;
  }

  addVacancyToCollectionIfMissing<Type extends Pick<IVacancy, 'id'>>(
    vacancyCollection: Type[],
    ...vacanciesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacancies: Type[] = vacanciesToCheck.filter(isPresent);
    if (vacancies.length > 0) {
      const vacancyCollectionIdentifiers = vacancyCollection.map(vacancyItem => this.getVacancyIdentifier(vacancyItem)!);
      const vacanciesToAdd = vacancies.filter(vacancyItem => {
        const vacancyIdentifier = this.getVacancyIdentifier(vacancyItem);
        if (vacancyCollectionIdentifiers.includes(vacancyIdentifier)) {
          return false;
        }
        vacancyCollectionIdentifiers.push(vacancyIdentifier);
        return true;
      });
      return [...vacanciesToAdd, ...vacancyCollection];
    }
    return vacancyCollection;
  }

  protected convertDateFromClient<T extends IVacancy | NewVacancy | PartialUpdateVacancy>(vacancy: T): RestOf<T> {
    return {
      ...vacancy,
      dateOfPosting: vacancy.dateOfPosting?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVacancy: RestVacancy): IVacancy {
    return {
      ...restVacancy,
      dateOfPosting: restVacancy.dateOfPosting ? dayjs(restVacancy.dateOfPosting) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacancy>): HttpResponse<IVacancy> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacancy[]>): HttpResponse<IVacancy[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
