import { MAX_AGE, setTokenCookie, getTokenCookie } from './auth-cookies';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
const JWT_SECRET = process.env.JWT_SECRET;

export function setLoginSession(res: Response, session: { userId: string }) {
  const createdAt = Date.now();
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  console.log('obj', obj);
  const token = jwt.sign(obj, JWT_SECRET);
  setTokenCookie(res, token);
}

export async function getLoginSession(req: Request) {
  const token = getTokenCookie(req);

  if (!token) return;

  const session = jwt.verify(token, JWT_SECRET);

  if (typeof session === 'string') return;

  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error('Session expired');
  }

  return session;
}
