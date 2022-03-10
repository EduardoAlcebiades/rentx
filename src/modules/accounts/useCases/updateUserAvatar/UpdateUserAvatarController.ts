import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { UpdateUserAvatarService } from './UpdateUserAvatarService';

class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { file } = request;

    if (!file) throw new AppError('No such file');

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    await updateUserAvatarService.execute({
      userId: id,
      avatarFile: file.filename,
    });

    return response.status(204).send();
  }
}

export { UpdateUserAvatarController };
