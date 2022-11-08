import { Request, Response, NextFunction } from 'express';
import { getLoginSession } from '../lib/auth';

const isLogged = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getLoginSession(req);

  if (!session) {
    res.status(401).end('Authentication token is invalid, please log in');
    return;
  }

  const userId = session.id;

  req.userId = userId;
  next();
};
