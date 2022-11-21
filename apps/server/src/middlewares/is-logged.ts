import { Request, Response, NextFunction } from 'express';
import { getLoginSession } from '@event-organizer/auth';

export const isLoggedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getLoginSession(req);

  if (!session) {
    console.log('No session in isLoggedMiddleware');
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }
  req.userId = session.user.userId;
  next();
};
