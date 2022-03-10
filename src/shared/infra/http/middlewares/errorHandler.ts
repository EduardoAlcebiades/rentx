import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../../errors/AppError';

interface IError {
  name?: string;
  message: string;
  statusCode: number;
  stack?: string;
}

async function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Promise<Response> {
  const { name, message, stack } = err;

  const error: IError = { name, message, statusCode: 500 };

  if (err instanceof AppError) error.statusCode = err.statusCode;
  else error.stack = stack;

  return response.status(error.statusCode).json({ error });
}

export { errorHandler };
