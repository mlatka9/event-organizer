import { clearDB } from '@event-organizer/prisma-client';
import * as request from 'supertest';
import app from '../src/app';

const agent = request.agent(app);

const users = [
  {
    name: 'userNormal',
    email: 'normal@test.test',
    password: 'normal123',
  },
  {
    name: 'userAdmin',
    email: 'admin@test.test',
    password: 'admin123',
  },
] as const;

type UserEmailsType = typeof users[number]['email'];

// const agent = supertest.agent('localhost:3333');

const createTestUsers = async () => {
  await agent.post('/api/auth/register').send(users[0]);
  await agent.post('/api/auth/register').send(users[1]);
};

const loginAsUser = async (userEmail: UserEmailsType) => {
  switch (userEmail) {
    case 'normal@test.test':
      await agent.post('/api/auth/login').send(users[0]);
      break;
    case 'admin@test.test':
      await agent.post('/api/auth/login').send(users[1]);
      break;
  }
};

export { clearDB, agent, createTestUsers, loginAsUser };
