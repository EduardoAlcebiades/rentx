import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { Car } from '../../infra/typeorm/entities/Car';
import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  private cars: Car[];

  constructor() {
    this.cars = [];
  }

  async findById(id: string): Promise<Car> {
    const car = this.cars.find(car => car.id === id);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.cars.find(car => car.license_plate === license_plate);

    return car;
  }

  async findAllAvailable(
    name?: string,
    brand?: string,
    category_id?: string,
  ): Promise<Car[]> {
    const cars = this.cars.filter(
      car =>
        car.is_available &&
        (!name || car.name === name) &&
        (!brand || car.brand === brand) &&
        (!category_id || car.category_id === category_id),
    );

    return cars;
  }

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      is_available: true,
      created_at: new Date(),
    });

    this.cars.push(car);

    return car;
  }

  async turnAvailable(id: string, is_available: boolean): Promise<void> {
    const index = this.cars.findIndex(car => car.id === id);

    if (index < 0) throw new AppError('Car not found', 404);

    this.cars[index].is_available = is_available;
  }
}

export { CarsRepositoryInMemory };
