import { clearDB, agent, createTestUser, loginAsUser } from './utils';

const newEventData = {
  name: 'Dzień sportu',
  description: 'Zapraszam wszystkich',
  street: 'Krakowska 10',
  city: 'Tarnów',
  country: 'Polska',
  postCode: '33-100',
  startDate: '2023-01-20T16:00:00.000Z',
  endDate: '2023-01-25T17:00:00.000Z',
  latitude: 50,
  longitude: 22,
  tags: ['free', 'open'],
  normalizedCity: 'Tarnów',
  eventVisibilityStatus: 'PUBLIC',
  eventLocationStatus: 'STATIONARY',
  bannerImage: 'https://res.cloudinary.com/dw6bikqwf/image/upload/v1673192753/okvoynityjlkxqp8qzik.webp',
  categoryId: '1',
};

describe('Events routes', () => {
  beforeAll((done) => {
    // await clearDB();
    // await createTestUser();
    clearDB()
      .then(createTestUser)
      .then(() => done());
  });

  test('POST /api/events - logged user can create new event', async () => {
    try {
      await loginAsUser('test@test.test');
    } catch (err) {
      console.log(err);
    }

    const res = await agent.post('/api/events').send(newEventData);

    console.log(res.body);

    expect(res.status).toEqual(201);
    const events = await agent.get('/api/events');
    expect(events.body.events).toHaveLength(1);
  });

  test('GET /api/events - list of events', async () => {
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
    await loginAsUser('test2@test.test');
    const allEventsResponse = await agent.get('/api/events');
    const eventToUpdateId = allEventsResponse.body.events[0].id;

    const updateEventResponse = await agent
      .put(`/api/events/${eventToUpdateId}`)
      .send({ ...newEventData, name: 'Nowa nazwa wydarzenia', endDate: '2023-01-27T17:00:00.000Z' });

    expect(updateEventResponse.status).toEqual(401);
  });
});
