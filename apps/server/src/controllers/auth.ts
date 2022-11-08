import { Request, Response } from 'express';
import * as passport from 'passport';
import { getLoginSession, setLoginSession } from '../lib/auth';
import { removeTokenCookie } from '../lib/auth-cookies';
import prisma from '../lib/prisma';
import { createUser } from '../lib/user';

const authenticate = (method: string, req: Request, res: Response) =>
  new Promise<{ userId: string }>((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      console.log('token w authenticate', token);
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });

const register = async (req: Request, res: Response) => {
  console.log(req.body);
  //todo zod
  const { email, password } = req.body;
  await createUser(email, password);
  res.status(201).end();
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await authenticate('local', req, res);

    const session = { ...user };
    setLoginSession(res, session);
    res.status(200).json(session);
  } catch (err) {
    res.status(401).end('Wrong credentials');
  }
};

const logout = async (req: Request, res: Response) => {
  removeTokenCookie(res);
  res.writeHead(302, { Location: '/' }).end();
};

const me = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  const formattedUser = { userId: user.id };

  res.status(200).json(formattedUser);
};

export default {
  register,
  login,
  logout,
  me,
};
