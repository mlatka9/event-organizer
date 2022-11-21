import { Request, Response } from 'express';
import * as passport from 'passport';
import { getLoginSession, setLoginSession } from '@event-organizer/auth';
import { removeTokenCookie } from '@event-organizer/auth';
import { prisma } from '@event-organizer/prisma-client';
import { createUser } from '../lib/user';
import { UnauthenticatedError, ValidationError } from '../errors';
import { SessionType, SessionUserType } from '@event-organizer/shared-types';
import { credentialsSchema } from '@event-organizer/shared-types';
import { generateErrorMessage } from 'zod-error';

const authenticate = (method: string, req: Request, res: Response) =>
  new Promise<SessionUserType>((resolve, reject) => {
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    })(req, res);
  });

const register = async (req: Request, res: Response) => {
  const validation = credentialsSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  const { email, password } = validation.data;
  await createUser(email, password);
  res.status(201).end();
};

const login = async (req: Request, res: Response) => {
  console.log('LOGIN');
  const validation = credentialsSchema.safeParse(req.body);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  try {
    const user = await authenticate('local', req, res);
    const sessionData = setLoginSession(res, user);
    const formattedSessionData: SessionType = {
      createdAt: new Date(sessionData.createdAt),
      expiredAt: new Date(sessionData.createdAt + sessionData.maxAge * 1000),
      user: sessionData.user,
    };
    res.status(200).json(formattedSessionData);
  } catch (err) {
    if (err instanceof Error) {
      throw new UnauthenticatedError('Wrong credentials');
    }
  }
};

const logout = async (req: Request, res: Response) => {
  removeTokenCookie(res);
  res.status(200).end();
};

const me = async (req: Request, res: Response) => {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId,
    },
  });

  if (!user) {
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  const formattedSessionData: SessionType = {
    createdAt: new Date(session.createdAt),
    expiredAt: new Date(session.createdAt + session.maxAge * 1000),
    user: {
      userId: user.id,
      name: user.name,
      image: user.image,
    },
  };

  res.status(200).json(formattedSessionData);
};

export default {
  register,
  login,
  logout,
  me,
};
