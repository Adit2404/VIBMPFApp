import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAtsUser, NewAtsUser } from '../ats-user.model';

export type PartialUpdateAtsUser = Partial<IAtsUser> & Pick<IAtsUser, 'id'>;

export type EntityResponseType = HttpResponse<IAtsUser>;
export type EntityArrayResponseType = HttpResponse<IAtsUser[]>;

@Injectable({ providedIn: 'root' })
export class AtsUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ats-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(atsUser: NewAtsUser): Observable<EntityResponseType> {
    return this.http.post<IAtsUser>(this.resourceUrl, atsUser, { observe: 'response' });
  }

  update(atsUser: IAtsUser): Observable<EntityResponseType> {
    return this.http.put<IAtsUser>(`${this.resourceUrl}/${this.getAtsUserIdentifier(atsUser)}`, atsUser, { observe: 'response' });
  }

  partialUpdate(atsUser: PartialUpdateAtsUser): Observable<EntityResponseType> {
    return this.http.patch<IAtsUser>(`${this.resourceUrl}/${this.getAtsUserIdentifier(atsUser)}`, atsUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAtsUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAtsUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAtsUserIdentifier(atsUser: Pick<IAtsUser, 'id'>): number {
    return atsUser.id;
  }

  compareAtsUser(o1: Pick<IAtsUser, 'id'> | null, o2: Pick<IAtsUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getAtsUserIdentifier(o1) === this.getAtsUserIdentifier(o2) : o1 === o2;
  }

  addAtsUserToCollectionIfMissing<Type extends Pick<IAtsUser, 'id'>>(
    atsUserCollection: Type[],
    ...atsUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const atsUsers: Type[] = atsUsersToCheck.filter(isPresent);
    if (atsUsers.length > 0) {
      const atsUserCollectionIdentifiers = atsUserCollection.map(atsUserItem => this.getAtsUserIdentifier(atsUserItem)!);
      const atsUsersToAdd = atsUsers.filter(atsUserItem => {
        const atsUserIdentifier = this.getAtsUserIdentifier(atsUserItem);
        if (atsUserCollectionIdentifiers.includes(atsUserIdentifier)) {
          return false;
        }
        atsUserCollectionIdentifiers.push(atsUserIdentifier);
        return true;
      });
      return [...atsUsersToAdd, ...atsUserCollection];
    }
    return atsUserCollection;
  }
}
