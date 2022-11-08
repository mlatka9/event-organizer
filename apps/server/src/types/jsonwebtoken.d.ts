export {};

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string,
    createdAt: number;
    maxAge: number;
  }
}
