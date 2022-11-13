export {};

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    createdAt: number;
    maxAge: number;
  }
}
