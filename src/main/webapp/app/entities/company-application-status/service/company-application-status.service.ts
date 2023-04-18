import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompanyApplicationStatus, NewCompanyApplicationStatus } from '../company-application-status.model';

export type PartialUpdateCompanyApplicationStatus = Partial<ICompanyApplicationStatus> & Pick<ICompanyApplicationStatus, 'id'>;

export type EntityResponseType = HttpResponse<ICompanyApplicationStatus>;
export type EntityArrayResponseType = HttpResponse<ICompanyApplicationStatus[]>;

@Injectable({ providedIn: 'root' })
export class CompanyApplicationStatusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/company-application-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(companyApplicationStatus: NewCompanyApplicationStatus): Observable<EntityResponseType> {
    return this.http.post<ICompanyApplicationStatus>(this.resourceUrl, companyApplicationStatus, { observe: 'response' });
  }

  update(companyApplicationStatus: ICompanyApplicationStatus): Observable<EntityResponseType> {
    return this.http.put<ICompanyApplicationStatus>(
      `${this.resourceUrl}/${this.getCompanyApplicationStatusIdentifier(companyApplicationStatus)}`,
      companyApplicationStatus,
      { observe: 'response' }
    );
  }

  partialUpdate(companyApplicationStatus: PartialUpdateCompanyApplicationStatus): Observable<EntityResponseType> {
    return this.http.patch<ICompanyApplicationStatus>(
      `${this.resourceUrl}/${this.getCompanyApplicationStatusIdentifier(companyApplicationStatus)}`,
      companyApplicationStatus,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICompanyApplicationStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompanyApplicationStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCompanyApplicationStatusIdentifier(companyApplicationStatus: Pick<ICompanyApplicationStatus, 'id'>): number {
    return companyApplicationStatus.id;
  }

  compareCompanyApplicationStatus(
    o1: Pick<ICompanyApplicationStatus, 'id'> | null,
    o2: Pick<ICompanyApplicationStatus, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getCompanyApplicationStatusIdentifier(o1) === this.getCompanyApplicationStatusIdentifier(o2) : o1 === o2;
  }

  addCompanyApplicationStatusToCollectionIfMissing<Type extends Pick<ICompanyApplicationStatus, 'id'>>(
    companyApplicationStatusCollection: Type[],
    ...companyApplicationStatusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const companyApplicationStatuses: Type[] = companyApplicationStatusesToCheck.filter(isPresent);
    if (companyApplicationStatuses.length > 0) {
      const companyApplicationStatusCollectionIdentifiers = companyApplicationStatusCollection.map(
        companyApplicationStatusItem => this.getCompanyApplicationStatusIdentifier(companyApplicationStatusItem)!
      );
      const companyApplicationStatusesToAdd = companyApplicationStatuses.filter(companyApplicationStatusItem => {
        const companyApplicationStatusIdentifier = this.getCompanyApplicationStatusIdentifier(companyApplicationStatusItem);
        if (companyApplicationStatusCollectionIdentifiers.includes(companyApplicationStatusIdentifier)) {
          return false;
        }
        companyApplicationStatusCollectionIdentifiers.push(companyApplicationStatusIdentifier);
        return true;
      });
      return [...companyApplicationStatusesToAdd, ...companyApplicationStatusCollection];
    }
    return companyApplicationStatusCollection;
  }
}
