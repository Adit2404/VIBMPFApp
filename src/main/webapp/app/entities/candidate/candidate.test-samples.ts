import { ICandidate, NewCandidate } from './candidate.model';

export const sampleWithRequiredData: ICandidate = {
  id: 59103,
};

export const sampleWithPartialData: ICandidate = {
  id: 33999,
};

export const sampleWithFullData: ICandidate = {
  id: 97788,
};

export const sampleWithNewData: NewCandidate = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
