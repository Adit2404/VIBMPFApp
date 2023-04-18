import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompanyUser, NewCompanyUser } from '../company-user.model';

export type PartialUpdateCompanyUser = Partial<ICompanyUser> & Pick<ICompanyUser, 'id'>;

export type EntityResponseType = HttpResponse<ICompanyUser>;
export type EntityArrayResponseType = HttpResponse<ICompanyUser[]>;

@Injectable({ providedIn: 'root' })
export class CompanyUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/company-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(companyUser: NewCompanyUser): Observable<EntityResponseType> {
    return this.http.post<ICompanyUser>(this.resourceUrl, companyUser, { observe: 'response' });
  }

  update(companyUser: ICompanyUser): Observable<EntityResponseType> {
    return this.http.put<ICompanyUser>(`${this.resourceUrl}/${this.getCompanyUserIdentifier(companyUser)}`, companyUser, {
      observe: 'response',
    });
  }

  partialUpdate(companyUser: PartialUpdateCompanyUser): Observable<EntityResponseType> {
    return this.http.patch<ICompanyUser>(`${this.resourceUrl}/${this.getCompanyUserIdentifier(companyUser)}`, companyUser, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompanyUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompanyUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyUserIdentifier(companyUser: Pick<ICompanyUser, 'id'>): number {
    return companyUser.id;
  }

  compareCompanyUser(o1: Pick<ICompanyUser, 'id'> | null, o2: Pick<ICompanyUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getCompanyUserIdentifier(o1) === this.getCompanyUserIdentifier(o2) : o1 === o2;
  }

  addCompanyUserToCollectionIfMissing<Type extends Pick<ICompanyUser, 'id'>>(
    companyUserCollection: Type[],
    ...companyUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companyUsers: Type[] = companyUsersToCheck.filter(isPresent);
    if (companyUsers.length > 0) {
      const companyUserCollectionIdentifiers = companyUserCollection.map(
        companyUserItem => this.getCompanyUserIdentifier(companyUserItem)!
      );
      const companyUsersToAdd = companyUsers.filter(companyUserItem => {
        const companyUserIdentifier = this.getCompanyUserIdentifier(companyUserItem);
        if (companyUserCollectionIdentifiers.includes(companyUserIdentifier)) {
          return false;
        }
        companyUserCollectionIdentifiers.push(companyUserIdentifier);
        return true;
      });
      return [...companyUsersToAdd, ...companyUserCollection];
    }
    return companyUserCollection;
  }
}
