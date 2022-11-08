import { StatusCodes } from 'http-status-codes';

export class CustomAPIError extends Error {
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}
