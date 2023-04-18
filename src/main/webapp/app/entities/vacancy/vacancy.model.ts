import dayjs from 'dayjs/esm';
import { ICompany } from 'app/entities/company/company.model';

export interface IVacancy {
  id: number;
  name?: string | null;
  dateOfPosting?: dayjs.Dayjs | null;
  description?: string | null;
  employmentType?: string | null;
  location?: string | null;
  video?: string | null;
  videoContentType?: string | null;
  status?: string | null;
  isOpen?: boolean | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewVacancy = Omit<IVacancy, 'id'> & { id: null };
