import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenService } from './RefreshTokenService';

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refresh_token =
      request.body.token ||
      request.header['x-access-token'] ||
      request.query.token;

    const refreshTokenService = container.resolve(RefreshTokenService);

    const authInfo = await refreshTokenService.execute(refresh_token);

    return response.json(authInfo);
  }
}

export { RefreshTokenController };
