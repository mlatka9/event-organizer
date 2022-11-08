import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors';

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log('MAM CIE ERRRORKU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.log(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong try again later' });
};

export default errorHandlerMiddleware;
