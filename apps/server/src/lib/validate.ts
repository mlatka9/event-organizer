import { generateErrorMessage } from 'zod-error';
import { ValidationError } from '../errors';
import { ZodType } from 'zod';

export const validate = <T, U>(schema: ZodType<T, any, U>, objectToValidate: Record<string, unknown>): T => {
  const validation = schema.safeParse(objectToValidate);

  if (!validation.success) {
    const errorMessage = generateErrorMessage(validation.error.issues);
    throw new ValidationError(errorMessage);
  }

  return validation.data;
};
