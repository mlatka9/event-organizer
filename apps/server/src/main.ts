import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import authRoutes from './routes/auth';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { localStrategy } from './lib/password-local';

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

passport.use(localStrategy);

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

const port = process.env.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});

server.on('error', console.error);
