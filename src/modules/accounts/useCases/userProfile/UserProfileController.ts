import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserProfileService } from './UserProfileService';

class UserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const profileUserService = container.resolve(UserProfileService);

    const user = await profileUserService.execute(id);

    return response.json(user);
  }
}

export { UserProfileController };
