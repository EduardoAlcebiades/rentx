import { CarImage } from '../infra/typeorm/entities/CarImage';

interface ICarImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImage>;
  delete(car_id: string): Promise<string[]>;
}

export { ICarImagesRepository };
