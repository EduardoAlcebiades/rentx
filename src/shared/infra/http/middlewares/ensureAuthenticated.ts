import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '../../../errors/AppError';

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('Unauthorized', 401);

  const [, token] = authHeader.split(' ');

  let userId: string;

  try {
    const decoded = verify(token, authConfig.token.secret);

    userId = decoded.sub as string;
  } catch (err) {
    throw new AppError('Unauthorized', 401);
  }

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(userId as string);

  if (!user) throw new AppError('Unauthorized', 401);

  request.user = { id: user.id };

  next();
}

export { ensureAuthenticated };
