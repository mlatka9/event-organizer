import { clearDB, agent, createTestUsers, loginAsUser } from './utils';
import { eventToDeleteData, newEventData } from './mock-data';

describe('Events routes', () => {
  beforeAll((done) => {
    clearDB()
      .then(() => createTestUsers())
      .then(() => done());
  });

  test('POST /api/events - not logged user cannot create new event', async () => {
    await agent.post('/api/auth/logout');
    const res = await agent.post('/api/events').send(newEventData);

    expect(res.status).toEqual(401);
  });

  test('POST /api/events - logged user can create new event', async () => {
    await loginAsUser('admin@test.test');
    const res = await agent.post('/api/events').send(newEventData);

    expect(res.status).toEqual(201);
    const events = await agent.get('/api/events');
    expect(events.body.events).toHaveLength(1);
  });

  test('POST /api/events - cannot create new event with empty body', async () => {
    await agent.post('/api/auth/logout');
    const res = await agent.post('/api/events');

    expect(res.status).toEqual(400);
  });

  test('GET /api/events - user can display list of events', async () => {
    const res = await agent.get('/api/events');
    expect(res.status).toEqual(200);

    expect(res.body.events).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Dzień sportu',
        displayAddress: 'Krakowska 10 Tarnów Polska 33-100',
        participantsCount: 1,
        startDate: '2023-01-20T16:00:00.000Z',
        endDate: '2023-01-25T17:00:00.000Z',
        latitude: 50,
        longitude: 22,
        bannerImage: 'https://res.cloudinary.com/dw6bikqwf/image/upload/v1673192753/okvoynityjlkxqp8qzik.webp',
        visibilityStatus: 'PUBLIC',
        locationStatus: 'STATIONARY',
      }),
    ]);
  });

  test('PUT /api/events - event admin can update event', async () => {
    const allEventsResponse = await agent.get('/api/events');

    const eventToUpdateId = allEventsResponse.body.events[0].id;

    const updateEventResponse = await agent
      .put(`/api/events/${eventToUpdateId}`)
      .send({ ...newEventData, name: 'Nowa nazwa wydarzenia', endDate: '2023-01-27T17:00:00.000Z' });
    expect(updateEventResponse.status).toEqual(200);

    const allEventsResponseAfterUpdate = await agent.get('/api/events');

    expect(allEventsResponseAfterUpdate.body.events).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Nowa nazwa wydarzenia',
        displayAddress: 'Krakowska 10 Tarnów Polska 33-100',
        participantsCount: 1,
        startDate: '2023-01-20T16:00:00.000Z',
        endDate: '2023-01-27T17:00:00.000Z',
        latitude: 50,
        longitude: 22,
        bannerImage: 'https://res.cloudinary.com/dw6bikqwf/image/upload/v1673192753/okvoynityjlkxqp8qzik.webp',
        visibilityStatus: 'PUBLIC',
        locationStatus: 'STATIONARY',
      }),
    ]);
  });

  test('PUT /api/events - user who is not admin cannot update event', async () => {
    await loginAsUser('normal@test.test');
    const allEventsResponse = await agent.get('/api/events');

    const eventToUpdateId = allEventsResponse.body.events[0].id;

    const updateEventResponse = await agent
      .put(`/api/events/${eventToUpdateId}`)
      .send({ ...newEventData, name: 'Nowa nazwa wydarzenia', endDate: '2023-01-27T17:00:00.000Z' });

    expect(updateEventResponse.status).toEqual(401);
  });

  test('DELETE /api/events/:id - user admin can delete event', async () => {
    await loginAsUser('admin@test.test');

    await agent.post('/api/events').send(eventToDeleteData);
    const allEventsResponse = await agent.get('/api/events');
    const eventToDeleteId = allEventsResponse.body.events.find(
      (e: { name: string }) => e.name === eventToDeleteData.name
    )['id'];

    console.log('eventToDeleteId', eventToDeleteId);

    const deleteEventResponse = await agent.delete(`/api/events/${eventToDeleteId}`);

    expect(deleteEventResponse.status).toEqual(204);
  });

  test('DELETE /api/events/:id - user who is not admin cannot delete event', async () => {
    await loginAsUser('admin@test.test');

    await agent.post('/api/events').send(eventToDeleteData);
    await loginAsUser('normal@test.test');
    const allEventsResponse = await agent.get('/api/events');
    const eventToDeleteId = allEventsResponse.body.events.find(
      (e: { name: string }) => e.name === eventToDeleteData.name
    )['id'];
    const deleteEventResponse = await agent.delete(`/api/events/${eventToDeleteId}`);
    expect(deleteEventResponse.status).toEqual(401);

    await loginAsUser('admin@test.test');
    const deleteEventResponse1 = await agent.delete(`/api/events/${eventToDeleteId}`);
    expect(deleteEventResponse1.status).toEqual(204);
  });

  test('PUT /api/events/:eventId/user/:userId - logged user can join event', async () => {
    await loginAsUser('admin@test.test');
    await agent.post('/api/events').send({ ...newEventData, name: 'Testowanie dołączenia do grup' });
    await loginAsUser('normal@test.test');

    const allEventsResponse = await agent.get('/api/events');
    const eventToJoinId = allEventsResponse.body.events.find((e: any) => e.name === 'Testowanie dołączenia do grup')[
      'id'
    ];

    const meResponse = await agent.get('/api/auth/me');

    const meId = meResponse.body.user.userId;
    const joinEventResponse = await agent.post(`/api/events/${eventToJoinId}/user/${meId}`);
    expect(joinEventResponse.status).toEqual(201);
  });

  test('PUT /api/events/:eventId/user/:userId - not logged user cannot join event', async () => {
    await loginAsUser('admin@test.test');
    const allEventsResponse = await agent.get('/api/events');
    const eventToJoinId = allEventsResponse.body.events.find((e: any) => e.name === 'Testowanie dołączenia do grup')[
      'id'
    ];

    const meResponse = await agent.get('/api/auth/me');
    const meId = meResponse.body.user.userId;
    await agent.post('/api/auth/logout');

    const joinEventResponse = await agent.post(`/api/events/${eventToJoinId}/user/${meId}`);
    expect(joinEventResponse.status).toEqual(409);
  });

  test('PUT /api/events/:eventId/user/:userId - user cannot join event when provided eventId is not valid', async () => {
    const joinEventResponse = await agent.post(`/api/events/invalidEventId/user/invalidUserId`);
    expect(joinEventResponse.status).toEqual(404);
  });
});
