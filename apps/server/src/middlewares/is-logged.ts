import { Request, Response, NextFunction } from 'express';
import { getLoginSession } from '@event-organizer/auth';

export const isLoggedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getLoginSession(req);

  if (!session) {
    console.log('BRAK SESJI');
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  console.log('MIDDLE END');

  req.userId = session.userId;
  next();
};
