import { ICompanyUser, NewCompanyUser } from './company-user.model';

export const sampleWithRequiredData: ICompanyUser = {
  id: 31977,
};

export const sampleWithPartialData: ICompanyUser = {
  id: 8411,
};

export const sampleWithFullData: ICompanyUser = {
  id: 99434,
};

export const sampleWithNewData: NewCompanyUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
