import { getJestProjects } from '@nrwl/jest';

// process.env.DATABASE_URL = 'postgres://postgres:postgrespw@localhost:49153/event_organizer_db';
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

export default {
  projects: getJestProjects(),
};
