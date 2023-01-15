import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  email: z.string().min(1, { message: 'email is required' }).email({ message: 'provide valid email address' }),
  password: z.string().min(1, { message: 'password is required' }),
});

export const credentialsSchema = z.object({
  email: z.string().min(1, { message: 'email is required' }).email({ message: 'provide valid email address' }),
  password: z.string().min(1, { message: 'password is required' }),
});
