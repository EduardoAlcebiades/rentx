import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImageService } from './UploadCarImagesService';

interface IFile {
  filename: string;
}

class UploadCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const files = request.files as IFile[];

    const uploadCarImageService = container.resolve(UploadCarImageService);

    const imagesName = files.map(file => file.filename);

    await uploadCarImageService.execute({ car_id: id, imagesName });

    return response.status(201).send();
  }
}

export { UploadCarImageController };
