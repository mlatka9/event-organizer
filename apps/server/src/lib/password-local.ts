import * as Local from 'passport-local';
import { prisma } from '@event-organizer/prisma-client';
import { validatePassword } from './user';
import { SessionUserType } from '@event-organizer/shared-types';

export const localStrategy = new Local.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function (email, password, done) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      done(new Error('Invalid username and password combination'));
      return;
    }
    const isMatch = await validatePassword(user.hashPassword, password);
    if (isMatch) {
      const sessionUser: SessionUserType = {
        userId: user.id,
        name: user.name,
        image: user.image,
      };
      done(null, sessionUser);
    } else {
      done(new Error('Invalid username and password combination'));
    }
  }
);
