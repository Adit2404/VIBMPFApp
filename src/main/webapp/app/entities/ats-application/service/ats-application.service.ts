import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAtsApplication, NewAtsApplication } from '../ats-application.model';

export type PartialUpdateAtsApplication = Partial<IAtsApplication> & Pick<IAtsApplication, 'id'>;

type RestOf<T extends IAtsApplication | NewAtsApplication> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestAtsApplication = RestOf<IAtsApplication>;

export type NewRestAtsApplication = RestOf<NewAtsApplication>;

export type PartialUpdateRestAtsApplication = RestOf<PartialUpdateAtsApplication>;

export type EntityResponseType = HttpResponse<IAtsApplication>;
export type EntityArrayResponseType = HttpResponse<IAtsApplication[]>;

@Injectable({ providedIn: 'root' })
export class AtsApplicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ats-applications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(atsApplication: NewAtsApplication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(atsApplication);
    return this.http
      .post<RestAtsApplication>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(atsApplication: IAtsApplication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(atsApplication);
    return this.http
      .put<RestAtsApplication>(`${this.resourceUrl}/${this.getAtsApplicationIdentifier(atsApplication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(atsApplication: PartialUpdateAtsApplication): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(atsApplication);
    return this.http
      .patch<RestAtsApplication>(`${this.resourceUrl}/${this.getAtsApplicationIdentifier(atsApplication)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAtsApplication>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAtsApplication[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAtsApplicationIdentifier(atsApplication: Pick<IAtsApplication, 'id'>): number {
    return atsApplication.id;
  }

  compareAtsApplication(o1: Pick<IAtsApplication, 'id'> | null, o2: Pick<IAtsApplication, 'id'> | null): boolean {
    return o1 && o2 ? this.getAtsApplicationIdentifier(o1) === this.getAtsApplicationIdentifier(o2) : o1 === o2;
  }

  addAtsApplicationToCollectionIfMissing<Type extends Pick<IAtsApplication, 'id'>>(
    atsApplicationCollection: Type[],
    ...atsApplicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const atsApplications: Type[] = atsApplicationsToCheck.filter(isPresent);
    if (atsApplications.length > 0) {
      const atsApplicationCollectionIdentifiers = atsApplicationCollection.map(
        atsApplicationItem => this.getAtsApplicationIdentifier(atsApplicationItem)!
      );
      const atsApplicationsToAdd = atsApplications.filter(atsApplicationItem => {
        const atsApplicationIdentifier = this.getAtsApplicationIdentifier(atsApplicationItem);
        if (atsApplicationCollectionIdentifiers.includes(atsApplicationIdentifier)) {
          return false;
        }
        atsApplicationCollectionIdentifiers.push(atsApplicationIdentifier);
        return true;
      });
      return [...atsApplicationsToAdd, ...atsApplicationCollection];
    }
    return atsApplicationCollection;
  }

  protected convertDateFromClient<T extends IAtsApplication | NewAtsApplication | PartialUpdateAtsApplication>(
    atsApplication: T
  ): RestOf<T> {
    return {
      ...atsApplication,
      date: atsApplication.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAtsApplication: RestAtsApplication): IAtsApplication {
    return {
      ...restAtsApplication,
      date: restAtsApplication.date ? dayjs(restAtsApplication.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAtsApplication>): HttpResponse<IAtsApplication> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAtsApplication[]>): HttpResponse<IAtsApplication[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
