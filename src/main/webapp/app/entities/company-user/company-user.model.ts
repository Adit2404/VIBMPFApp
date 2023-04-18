import { IAtsUser } from 'app/entities/ats-user/ats-user.model';
import { ICompany } from 'app/entities/company/company.model';

export interface ICompanyUser {
  id: number;
  atsUser?: Pick<IAtsUser, 'id'> | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewCompanyUser = Omit<ICompanyUser, 'id'> & { id: null };
