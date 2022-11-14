import * as Local from 'passport-local';
import { prisma } from '@event-organizer/prisma-client';
import { validatePassword } from './user';

export const localStrategy = new Local.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function (email, password, done) {
    console.log('localStrategy');
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log('localStrategy users', user);
    if (!user) {
      done(new Error('Invalid username and password combination'));
      return;
    }
    console.log(user);
    const isMatch = await validatePassword(user.hashPassword, password);
    if (isMatch) {
      //token content
      done(null, { userId: user.id });
    } else {
      done(new Error('Invalid username and password combination'));
    }
  }
);
