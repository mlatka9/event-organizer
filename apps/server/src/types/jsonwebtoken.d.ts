import { SessionUserType } from '@event-organizer/shared-types';

export {};

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    user: SessionUserType;
    createdAt: number;
    maxAge: number;
  }
}
