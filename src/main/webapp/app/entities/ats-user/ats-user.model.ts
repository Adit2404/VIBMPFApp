export interface IAtsUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  userId?: string | null;
  video?: string | null;
  videoContentType?: string | null;
  cv?: string | null;
  cvContentType?: string | null;
  password?: string | null;
  usertype?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
}

export type NewAtsUser = Omit<IAtsUser, 'id'> & { id: null };
