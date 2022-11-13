import { prisma } from '@event-organizer/prisma-client';
import * as bcrypt from 'bcryptjs';
import { ConflictError } from '../errors/conflict';

export const createUser = async (email: string, password: string) => {
  const duplicatedUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (duplicatedUser) {
    throw new ConflictError('User with provided email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  return await prisma.user.create({
    data: {
      email,
      hashPassword,
    },
  });
};

export const validatePassword = async (password: string, inputPassword: string) => {
  return await bcrypt.compare(inputPassword, password);
};
