import dayjs from 'dayjs/esm';

import { IVacancy, NewVacancy } from './vacancy.model';

export const sampleWithRequiredData: IVacancy = {
  id: 68654,
};

export const sampleWithPartialData: IVacancy = {
  id: 48437,
  name: 'Advanced Sahara Secured',
  description: 'front-end navigating up',
  employmentType: 'Towels',
  video: '../fake-data/blob/hipster.png',
  videoContentType: 'unknown',
};

export const sampleWithFullData: IVacancy = {
  id: 88828,
  name: 'Stand-alone Account quantifying',
  dateOfPosting: dayjs('2023-04-18'),
  description: 'heuristic',
  employmentType: 'generate navigate',
  location: 'Representative',
  video: '../fake-data/blob/hipster.png',
  videoContentType: 'unknown',
  status: 'override Coordinator',
  isOpen: true,
};

export const sampleWithNewData: NewVacancy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
