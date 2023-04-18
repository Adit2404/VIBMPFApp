import dayjs from 'dayjs/esm';

import { IEducation, NewEducation } from './education.model';

export const sampleWithRequiredData: IEducation = {
  id: 'de25c208-2161-4df4-b11e-521246732b6a',
};

export const sampleWithPartialData: IEducation = {
  id: '49744a01-04e4-4a9f-8b25-84f521ca5220',
  location: 'Producer',
  edate: dayjs('2023-04-18'),
};

export const sampleWithFullData: IEducation = {
  id: 'fdeb912f-3a0e-44fd-9f65-d9067796361f',
  title: 'Analyst clicks-and-mortar',
  company: 'Hat',
  location: 'cross-platform bluetooth world-class',
  sdate: dayjs('2023-04-18'),
  edate: dayjs('2023-04-18'),
  description: 'integrate',
};

export const sampleWithNewData: NewEducation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
