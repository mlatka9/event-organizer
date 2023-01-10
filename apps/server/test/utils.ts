import { clearDB } from '@event-organizer/prisma-client';
import * as request from 'supertest';
import app from '../src/app';

const agent = request.agent(app);

const users = [
  {
    name: 'userAdmin',
    email: 'test@test.test',
    password: 'qwe123',
  },
  {
    name: 'userNormal',
    email: 'test2@test.test',
    password: 'test222',
  },
] as const;

type UserEmailsType = typeof users[number]['email'];

// const agent = supertest.agent('localhost:3333');

const createTestUser = async () => {
  await agent.post('/api/auth/register').send(users[0]);
  await agent.post('/api/auth/register').send(users[1]);
};

const loginAsUser = async (userEmail: UserEmailsType) => {
  switch (userEmail) {
    case 'test@test.test':
      await agent.post('/api/auth/login').send(users[0]);
      break;
    case 'test2@test.test':
      await agent.post('/api/auth/login').send(users[1]);
      break;
  }
};

export { clearDB, agent, createTestUser, loginAsUser };
