import * as jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'token';
export const MAX_AGE = 60 * 60 * 8; // 8 hours

export function setLoginSession(res: ServerResponse, session: { userId: string }) {
  const createdAt = Date.now();
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  console.log('obj', obj);
  const token = jwt.sign(obj, JWT_SECRET);
  setTokenCookie(res, token);
}

export async function getLoginSession(req: IncomingMessage) {
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

export function getTokenCookie(req: IncomingMessage) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function setTokenCookie(res: ServerResponse, token: any) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res: ServerResponse) {
  console.log('removeTokenCookie');
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: IncomingMessage) {
  // req.
  // For API Routes we don't need to parse the cookies.
  // if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}
