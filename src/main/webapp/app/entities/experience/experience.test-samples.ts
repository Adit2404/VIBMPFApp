import dayjs from 'dayjs/esm';

import { IExperience, NewExperience } from './experience.model';

export const sampleWithRequiredData: IExperience = {
  id: '88d948ac-4077-47db-98dd-0eb3048753f4',
};

export const sampleWithPartialData: IExperience = {
  id: '77c797d8-62b4-4bf7-ae68-db560d3eccb3',
  title: 'SMTP',
  location: 'Group Generic Consultant',
  sdate: dayjs('2023-04-17'),
  description: 'scale Principal Tuna',
};

export const sampleWithFullData: IExperience = {
  id: 'db3e729b-cf4b-4223-83f9-234e2f8fd687',
  title: 'transmitting',
  company: 'e-tailers',
  location: 'index solid Ouguiya',
  sdate: dayjs('2023-04-18'),
  edate: dayjs('2023-04-17'),
  description: 'Centralized scalable',
};

export const sampleWithNewData: NewExperience = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
