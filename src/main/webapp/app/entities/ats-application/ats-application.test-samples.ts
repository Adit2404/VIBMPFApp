import dayjs from 'dayjs/esm';

import { IAtsApplication, NewAtsApplication } from './ats-application.model';

export const sampleWithRequiredData: IAtsApplication = {
  id: 5867,
};

export const sampleWithPartialData: IAtsApplication = {
  id: 46890,
};

export const sampleWithFullData: IAtsApplication = {
  id: 92388,
  date: dayjs('2023-04-17'),
};

export const sampleWithNewData: NewAtsApplication = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
