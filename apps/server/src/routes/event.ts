import { Router } from 'express';
import eventsRouter from '../controllers/events';

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/', eventsRouter.getAll);
publicRouter.get('/categories', eventsRouter.getAllCategories);
publicRouter.get('/normalized-cities', eventsRouter.getNormalizedCities);
publicRouter.get('/:id', eventsRouter.getEventInfo);

protectedRouter.post('/', eventsRouter.create);

const router = {
  publicRouter,
  protectedRouter,
};

export default router;
