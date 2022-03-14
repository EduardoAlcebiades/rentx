import { EntityRepository, getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '../../../dtos/ICreateCarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { Car } from '../entities/Car';

@EntityRepository()
class CarsRepository implements ICarsRepository {
  private respository: Repository<Car>;

  constructor() {
    this.respository = getRepository(Car);
  }

  async findById(id: string): Promise<Car> {
    const car = await this.respository.findOne(id);

    return car;
  }

  async findAllAvailable(
    name?: string,
    brand?: string,
    category_id?: string,
  ): Promise<Car[]> {
    const query = this.respository
      .createQueryBuilder('car')
      .where('car.is_available = :available', { available: true });

    if (name)
      query.andWhere('LOWER(car.name) = :name', { name: name.toLowerCase() });

    if (brand)
      query.andWhere('LOWER(car.brand) = :brand', {
        brand: brand.toLowerCase(),
      });

    if (category_id)
      query.andWhere('car.category_id = :category_id', { category_id });

    const cars = await query.getMany();

    return cars;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.respository.findOne({ license_plate });

    return car;
  }

  async create({
    id,
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.respository.create({
      id,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    await this.respository.save(car);

    return car;
  }

  async turnAvailable(id: string, is_available: boolean): Promise<void> {
    await this.respository
      .createQueryBuilder()
      .update()
      .set({ is_available })
      .where('id = :id', { id })
      .execute();
  }
}

export { CarsRepository };
