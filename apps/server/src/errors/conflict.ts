import { CustomAPIError } from './custom-api';
import { StatusCodes } from 'http-status-codes';

export class ConflictError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}
