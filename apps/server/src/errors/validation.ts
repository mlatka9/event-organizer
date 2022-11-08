import { CustomAPIError } from './custom-api';
import { StatusCodes } from 'http-status-codes';

export class ValidationError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
