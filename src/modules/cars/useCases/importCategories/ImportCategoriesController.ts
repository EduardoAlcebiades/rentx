import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { ImportCategoriesService } from './ImportCategoriesService';

class ImportCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    if (!file) throw new AppError('No such file');

    const importCategoriesService = container.resolve(ImportCategoriesService);

    await importCategoriesService.execute(file);

    return response.status(201).send();
  }
}

export { ImportCategoriesController };
