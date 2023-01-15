import { clearDB, agent, createTestUsers } from './utils';

describe('Auth routes', () => {
  beforeAll((done) => {
    clearDB()
      .then(() => createTestUsers())
      .then(() => done());
  });

  test('/api/auth/register - register account with valid body', async () => {
    const res = await agent
      .post('/api/auth/register')
      .send({ email: 'newtest@test.test', password: 'test123', name: 'newtestuser' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(201);
  });

  test('/api/auth/register - cannot register with empty body', async () => {
    const res = await agent.post('/api/auth/register').set('Accept', 'application/json');
    expect(res.status).toEqual(400);
  });

  test('/api/auth/register - cannot create user with existing username', async () => {
    const res = await agent
      .post('/api/auth/register')
      .send({ email: 'aaa@aaa.aaa', password: 'aaa123', name: 'newtestuser' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(409);
  });

  test('/api/auth/login - can login with valid credentials', async () => {
    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'normal@test.test', password: 'normal123' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body.user.name).toEqual('userNormal');
  });

  test('/api/auth/login - cannot login without provided email in body', async () => {
    const res = await agent.post('/api/auth/login').send({ password: 'normal123' }).set('Accept', 'application/json');

    expect(res.status).toEqual(400);
  });

  test('/api/auth/login - cannot login without provided password in body', async () => {
    const res = await agent
      .post('/api/auth/login')
      .send({ email: 'normal@test.test' })
      .set('Accept', 'application/json');

    expect(res.status).toEqual(400);
  });

  test('/api/auth/me user can get info about himself', async () => {
    const res = await agent.get('/api/auth/me').set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        createdAt: expect.any(String),
        expiredAt: expect.any(String),
        user: expect.objectContaining({
          userId: expect.any(String),
          name: 'userNormal',
          image: null,
        }),
      })
    );
  });

  test('/api/auth/logout User can logout', async () => {
    const MeRes = await agent.get('/api/auth/me').set('Accept', 'application/json');
    expect(MeRes.status).toEqual(200);
    expect(MeRes.body.user.name).toEqual('userNormal');

    const res = await agent.get('/api/auth/logout');
    expect(res.status).toEqual(200);

    const MeRes2 = await agent.get('/api/auth/me').set('Accept', 'application/json');
    expect(MeRes2.status).toEqual(401);
  });
});
