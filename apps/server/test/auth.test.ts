import { clearDB, agent } from './utils';

describe('Auth routes', () => {
  beforeAll((done) => {
    clearDB().then(() => done());
  });

  test('/api/auth/register - User can register', async () => {
    const res = await agent
      .post('/api/auth/register')
      .send({ email: 'test@test.test', password: 'test123', name: 'testuser' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
  });

  test('/api/auth/login - User can login with valid credentials', async () => {
    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'test@test.test', password: 'test123' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body.user.name).toEqual('testuser');
  });

  test('/api/auth/me User can get info about himself', async () => {
    const res = await agent.get('/api/auth/me').set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        createdAt: expect.any(String),
        expiredAt: expect.any(String),
        user: expect.objectContaining({
          userId: expect.any(String),
          name: 'testuser',
          image: null,
        }),
      })
    );
  });

  test('/api/auth/logout User can logout', async () => {
    const MeRes = await agent.get('/api/auth/me').set('Accept', 'application/json');
    expect(MeRes.status).toEqual(200);
    expect(MeRes.body.user.name).toEqual('testuser');

    const res = await agent.get('/api/auth/logout');
    expect(res.status).toEqual(200);

    const MeRes2 = await agent.get('/api/auth/me').set('Accept', 'application/json');
    expect(MeRes2.status).toEqual(401);
  });
});
