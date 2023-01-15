import 'express-async-errors';

import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/event';
import usersRouter from './routes/user';
import groupsRouter from './routes/group';
import categoriesRouter from './routes/category';
import errorHandlerMiddleware from './middlewares/error-handler';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { localStrategy } from './lib/password-local';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import { isLoggedMiddleware } from './middlewares/is-logged';
import { clearDB } from '../test/utils';

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:4200',
  })
);
// app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(morgan('tiny'));

passport.use(localStrategy);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes);

app.use('/api/categories', categoriesRouter);

app.use('/api/events', eventsRoutes.publicRouter);
app.use('/api/events', isLoggedMiddleware, eventsRoutes.protectedRouter);

app.use('/api/users', usersRouter.publicRouter);
app.use('/api/users', isLoggedMiddleware, usersRouter.protectedRouter);

app.use('/api/groups', groupsRouter.publicRouter);
app.use('/api/groups', isLoggedMiddleware, groupsRouter.protectedRouter);

if (process.env.NODE_ENVIRONMENT === 'test') {
  app.use('/api/testing/clear-db', async (req, res) => {
    await clearDB();
    res.status(200).end();
  });
}

app.use(errorHandlerMiddleware);

export default app;
