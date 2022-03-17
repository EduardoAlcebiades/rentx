import { inject, injectable } from 'tsyringe';
import { validate } from 'uuid';

import { IStorageProvider } from '../../../../shared/container/providers/StorageProvider/IStorageProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { CarsRepository } from '../../infra/typeorm/repositories/CarsRepository';
import { ICarImagesRepository } from '../../repositories/ICarImagesRepository';

interface IRequest {
  car_id: string;
  imagesName: string[];
}

@injectable()
class UploadCarImageService {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,
    @inject('CarsRepository')
    private carsRepository: CarsRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ car_id, imagesName }: IRequest): Promise<void> {
    if (!validate(car_id)) throw new AppError('car_id is not a valid uuid');

    const carExists = this.carsRepository.findById(car_id);

    if (!carExists) throw new AppError('Car not found', 404);

    const files = await this.carImagesRepository.delete(car_id);

    files.forEach(async file => {
      await this.storageProvider.delete(file, 'cars');
    });

    imagesName.forEach(async image_name => {
      const file = await this.storageProvider.save(image_name, 'cars');

      await this.carImagesRepository.create(car_id, file);
    });
  }
}

export { UploadCarImageService };
