import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  findById(id: string): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAllAvailable(
    name?: string,
    brand?: string,
    category_id?: string,
  ): Promise<Car[]>;
  create(data: ICreateCarDTO): Promise<Car>;
}

export { ICarsRepository };
