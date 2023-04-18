import { IAtsUser } from 'app/entities/ats-user/ats-user.model';

export interface ICandidate {
  id: number;
  atsUser?: Pick<IAtsUser, 'id'> | null;
}

export type NewCandidate = Omit<ICandidate, 'id'> & { id: null };
