import { validate, v4 as uuidV4 } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../repositories/inMemory/CarsRepositoryInMemory';
import { CreateCarService } from './CreateCarService';

let createCarService: CreateCarService;
let carsRepository: ICarsRepository;

describe('Create Car', () => {
  const car: ICreateCarDTO = {
    name: 'Sample name',
    description: 'Sample description',
    daily_rate: 100,
    license_plate: 'ABC-1234',
    fine_amount: 60,
    brand: 'Sample brand',
    category_id: uuidV4(),
  };

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    createCarService = new CreateCarService(carsRepository);
  });

  it('should be able to create a new car', async () => {
    const createdCar = await createCarService.execute(car);

    expect(validate(createdCar.id));
    expect(createdCar).toHaveProperty('created_at');
  });

  it('should not be able to create a new car when de category_id was not a valid uuid', () => {
    expect(async () => {
      const parsedData: ICreateCarDTO = { ...car, category_id: '1234' };

      await createCarService.execute(parsedData);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a car with existing license plate', async () => {
    await createCarService.execute(car);

    expect(async () => {
      await createCarService.execute({
        name: 'Sample name',
        description: 'Sample description',
        daily_rate: 100,
        license_plate: car.license_plate,
        fine_amount: 60,
        brand: 'Sample brand',
        category_id: null,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a new car with property available equals "true" by default', async () => {
    const createdCar = await createCarService.execute(car);

    expect(createdCar.is_available).toBe(true);
  });
});
