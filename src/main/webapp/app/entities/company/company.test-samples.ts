import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: '5683e9e4-f193-471b-b012-796b78137284',
};

export const sampleWithPartialData: ICompany = {
  id: '48053fa7-3981-47cb-a6e1-fa58bdeaab56',
};

export const sampleWithFullData: ICompany = {
  id: '8d06ee2f-639c-4c19-8dd6-bd15267f47c9',
  companySize: 41896,
  type: 'parse',
  video: '../fake-data/blob/hipster.png',
  videoContentType: 'unknown',
};

export const sampleWithNewData: NewCompany = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
