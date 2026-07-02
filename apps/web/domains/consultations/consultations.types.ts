export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  neetScore: number | null;
  state: string | null;
  country: string | null;
  preferredUniversity: string | null;
  preferredIntake: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationPayload {
  name: string;
  email: string;
  phone: string;
  neetScore?: number;
  state?: string;
  country?: string;
  preferredUniversity?: string;
  preferredIntake?: string;
}
