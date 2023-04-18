import dayjs from 'dayjs/esm';
import { ICandidate } from 'app/entities/candidate/candidate.model';

export interface IEducation {
  id: string;
  title?: string | null;
  company?: string | null;
  location?: string | null;
  sdate?: dayjs.Dayjs | null;
  edate?: dayjs.Dayjs | null;
  description?: string | null;
  candidate?: Pick<ICandidate, 'id'> | null;
}

export type NewEducation = Omit<IEducation, 'id'> & { id: null };
