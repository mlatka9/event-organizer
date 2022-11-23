import { Router } from 'express';
import groupsRouter from '../controllers/groups';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/', groupsRouter.getAllGroups);

protectedRouter.post('/', groupsRouter.createGroup);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
