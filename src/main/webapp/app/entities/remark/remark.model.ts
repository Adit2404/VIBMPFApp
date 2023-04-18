import dayjs from 'dayjs/esm';
import { IAtsApplication } from 'app/entities/ats-application/ats-application.model';
import { ICompanyUser } from 'app/entities/company-user/company-user.model';
import { ICandidate } from 'app/entities/candidate/candidate.model';

export interface IRemark {
  id: number;
  message?: string | null;
  date?: dayjs.Dayjs | null;
  atsApplication?: Pick<IAtsApplication, 'id'> | null;
  companyUser?: Pick<ICompanyUser, 'id'> | null;
  candidate?: Pick<ICandidate, 'id'> | null;
}

export type NewRemark = Omit<IRemark, 'id'> & { id: null };
