import { ICompanyApplicationStatus, NewCompanyApplicationStatus } from './company-application-status.model';

export const sampleWithRequiredData: ICompanyApplicationStatus = {
  id: 39153,
};

export const sampleWithPartialData: ICompanyApplicationStatus = {
  id: 53462,
};

export const sampleWithFullData: ICompanyApplicationStatus = {
  id: 17828,
  name: 'JSON copying Lead',
};

export const sampleWithNewData: NewCompanyApplicationStatus = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
