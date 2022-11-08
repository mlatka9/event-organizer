import * as Local from 'passport-local';
import prisma from './prisma';
import { validatePassword } from './user';

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
    console.log(user);
    const isMatch = await validatePassword(user.hashPassword, password);
    if (isMatch) {
      done(null, { userId: user.id });
    } else {
      done(new Error('Invalid username and password combination'));
    }
  }
);
