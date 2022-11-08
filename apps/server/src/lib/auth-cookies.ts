import { Request, Response } from 'express';
import { parse, serialize } from 'cookie';

const TOKEN_NAME = 'token';
export const MAX_AGE = 60 * 60 * 8; // 8 hours

export function getTokenCookie(req: Request) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function setTokenCookie(res: Response, token: any) {
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

export function removeTokenCookie(res: Response) {
  console.log('removeTokenCookie');
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: Request) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}