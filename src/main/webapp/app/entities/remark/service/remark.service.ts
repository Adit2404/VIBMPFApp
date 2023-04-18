import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRemark, NewRemark } from '../remark.model';

export type PartialUpdateRemark = Partial<IRemark> & Pick<IRemark, 'id'>;

type RestOf<T extends IRemark | NewRemark> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestRemark = RestOf<IRemark>;

export type NewRestRemark = RestOf<NewRemark>;

export type PartialUpdateRestRemark = RestOf<PartialUpdateRemark>;

export type EntityResponseType = HttpResponse<IRemark>;
export type EntityArrayResponseType = HttpResponse<IRemark[]>;

@Injectable({ providedIn: 'root' })
export class RemarkService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/remarks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(remark: NewRemark): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(remark);
    return this.http
      .post<RestRemark>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(remark: IRemark): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(remark);
    return this.http
      .put<RestRemark>(`${this.resourceUrl}/${this.getRemarkIdentifier(remark)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(remark: PartialUpdateRemark): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(remark);
    return this.http
      .patch<RestRemark>(`${this.resourceUrl}/${this.getRemarkIdentifier(remark)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRemark>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRemark[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRemarkIdentifier(remark: Pick<IRemark, 'id'>): number {
    return remark.id;
  }

  compareRemark(o1: Pick<IRemark, 'id'> | null, o2: Pick<IRemark, 'id'> | null): boolean {
    return o1 && o2 ? this.getRemarkIdentifier(o1) === this.getRemarkIdentifier(o2) : o1 === o2;
  }

  addRemarkToCollectionIfMissing<Type extends Pick<IRemark, 'id'>>(
    remarkCollection: Type[],
    ...remarksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const remarks: Type[] = remarksToCheck.filter(isPresent);
    if (remarks.length > 0) {
      const remarkCollectionIdentifiers = remarkCollection.map(remarkItem => this.getRemarkIdentifier(remarkItem)!);
      const remarksToAdd = remarks.filter(remarkItem => {
        const remarkIdentifier = this.getRemarkIdentifier(remarkItem);
        if (remarkCollectionIdentifiers.includes(remarkIdentifier)) {
          return false;
        }
        remarkCollectionIdentifiers.push(remarkIdentifier);
        return true;
      });
      return [...remarksToAdd, ...remarkCollection];
    }
    return remarkCollection;
  }

  protected convertDateFromClient<T extends IRemark | NewRemark | PartialUpdateRemark>(remark: T): RestOf<T> {
    return {
      ...remark,
      date: remark.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restRemark: RestRemark): IRemark {
    return {
      ...restRemark,
      date: restRemark.date ? dayjs(restRemark.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRemark>): HttpResponse<IRemark> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRemark[]>): HttpResponse<IRemark[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
