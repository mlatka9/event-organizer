import { getJestProjects } from '@nrwl/jest';

process.env.DATABASE_URL = 'postgres://postgres:postgrespw@localhost:49153/event_organizer_db';

export default {
  projects: getJestProjects(),
};
