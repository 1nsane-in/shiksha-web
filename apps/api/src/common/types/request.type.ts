import { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
