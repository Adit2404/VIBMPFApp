import { ICompany } from 'app/entities/company/company.model';

export interface ICompanyApplicationStatus {
  id: number;
  name?: string | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewCompanyApplicationStatus = Omit<ICompanyApplicationStatus, 'id'> & { id: null };
