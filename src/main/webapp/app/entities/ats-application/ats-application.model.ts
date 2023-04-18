import dayjs from 'dayjs/esm';
import { ICandidate } from 'app/entities/candidate/candidate.model';
import { IVacancy } from 'app/entities/vacancy/vacancy.model';
import { ICompanyApplicationStatus } from 'app/entities/company-application-status/company-application-status.model';

export interface IAtsApplication {
  id: number;
  date?: dayjs.Dayjs | null;
  candidate?: Pick<ICandidate, 'id'> | null;
  vacancy?: Pick<IVacancy, 'id'> | null;
  companyApplicationStatus?: Pick<ICompanyApplicationStatus, 'id'> | null;
}

export type NewAtsApplication = Omit<IAtsApplication, 'id'> & { id: null };
