import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { AppError } from '../../../errors/AppError';
import { client } from '../../redis';

const limiter = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'rateLimiter',
  points: Number(process.env.RATE_REQUESTS_AMOUNT), // 10 requests
  duration: Number(process.env.RATE_REQUESTS_SECONDS), // per 3 second by IP
});

async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}

export { rateLimiter };
