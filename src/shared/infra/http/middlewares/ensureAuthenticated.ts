import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '../../../errors/AppError';

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const SECRET = '3e79faab4dfe99dcfd772f936c0086d0cbf6571a';
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new AppError('Unauthorized', 401);

    const [, token] = authHeader.split(' ');

    const { sub: userId } = verify(token, SECRET);

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(userId as string);

    if (!user) throw new AppError('Unauthorized', 401);

    request.user = { id: user.id };

    next();
  } catch (err) {
    throw new AppError('Unauthorized', 401);
  }
}

export { ensureAuthenticated };
