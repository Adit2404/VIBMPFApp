import { IAtsUser, NewAtsUser } from './ats-user.model';

export const sampleWithRequiredData: IAtsUser = {
  id: 96548,
};

export const sampleWithPartialData: IAtsUser = {
  id: 60652,
  email: 'Elwyn38@hotmail.com',
  phoneNumber: 'program Berkshire',
  password: 'Carolina deposit Account',
  usertype: 'complexity e-markets',
  city: 'New Breanna',
};

export const sampleWithFullData: IAtsUser = {
  id: 6121,
  firstName: 'Bennett',
  lastName: 'Koelpin',
  email: 'Meda_Zemlak96@gmail.com',
  phoneNumber: 'systemic full-range',
  userId: 'back-end Mouse',
  video: '../fake-data/blob/hipster.png',
  videoContentType: 'unknown',
  cv: '../fake-data/blob/hipster.png',
  cvContentType: 'unknown',
  password: 'Bolivar',
  usertype: 'COM',
  streetAddress: 'Operations analyzing',
  postalCode: 'Florida Towels Horizontal',
  city: 'Lednerbury',
  stateProvince: 'haptic Product gold',
};

export const sampleWithNewData: NewAtsUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
