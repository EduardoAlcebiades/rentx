import { EntityRepository, getRepository, Repository } from 'typeorm';

import { ICarImagesRepository } from '../../../repositories/ICarImagesRepository';
import { CarImage } from '../entities/CarImage';

@EntityRepository()
class CarImagesRepository implements ICarImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = this.repository.create({
      car_id,
      image_name,
    });

    this.repository.save(carImage);

    return carImage;
  }

  async delete(car_id: string): Promise<string[]> {
    const files = await this.repository.find({ car_id });

    await this.repository.delete({ car_id });

    return files.map(file => file.image_name);
  }
}

export { CarImagesRepository };
