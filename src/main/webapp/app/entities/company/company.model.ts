export interface ICompany {
  id: string;
  companySize?: number | null;
  type?: string | null;
  video?: string | null;
  videoContentType?: string | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
