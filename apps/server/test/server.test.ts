import { agent } from './utils';

describe('Server', () => {
  test('Server works', async () => {
    const res = await agent.get('/');
    expect(res.body).toMatchObject({ message: 'Welcome to server!' });
  });
});
