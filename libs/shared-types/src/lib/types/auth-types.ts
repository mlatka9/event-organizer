import { z } from 'zod';
import { credentialsSchema } from '../schemas';

export interface SessionUserType {
  userId: string;
  name: string;
  image: string | null;
}

export interface SessionType {
  user: SessionUserType;
  createdAt: Date;
  expiredAt: Date;
}

export type CredentialsType = z.infer<typeof credentialsSchema>;
