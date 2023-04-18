import dayjs from 'dayjs/esm';

import { IRemark, NewRemark } from './remark.model';

export const sampleWithRequiredData: IRemark = {
  id: 46781,
};

export const sampleWithPartialData: IRemark = {
  id: 97208,
};

export const sampleWithFullData: IRemark = {
  id: 15849,
  message: 'Illinois Card',
  date: dayjs('2023-04-18'),
};

export const sampleWithNewData: NewRemark = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
