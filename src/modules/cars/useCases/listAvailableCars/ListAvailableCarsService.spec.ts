import { v4 as uuidV4 } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { Car } from '../../infra/typeorm/entities/Car';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../repositories/inMemory/CarsRepositoryInMemory';
import { ListAvailableCarsService } from './ListAvailableCarsService';

let listAvailableCarsService: ListAvailableCarsService;
let carsRepository: ICarsRepository;

describe('List Cars', () => {
  const carAvailables: ICreateCarDTO[] = [
    {
      name: 'Sample 1',
      description: 'Sample description 1',
      daily_rate: 100,
      license_plate: 'ABC-1111',
      fine_amount: 50,
      brand: 'Sample brand 1',
      category_id: uuidV4(),
    },
    {
      name: 'Sample 2',
      description: 'Sample description 2',
      daily_rate: 100,
      license_plate: 'ABC-2222',
      fine_amount: 50,
      brand: 'Sample brand 2',
      category_id: uuidV4(),
    },
    {
      name: 'Sample 3',
      description: 'Sample description 3',
      daily_rate: 100,
      license_plate: 'ABC-3333',
      fine_amount: 50,
      brand: 'Sample brand 3',
      category_id: uuidV4(),
    },
  ];

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listAvailableCarsService = new ListAvailableCarsService(carsRepository);
  });

  it('should be able to list all available cars', async () => {
    const createdCar = await carsRepository.create(carAvailables[0]);

    const cars = await listAvailableCarsService.execute({});

    expect(cars).toEqual([createdCar]);
  });

  it('should be able to list all available cars by name', async () => {
    let createdCar: Car;

    for (let i = 0; i < carAvailables.length; i += 1)
      // eslint-disable-next-line no-await-in-loop
      createdCar = await carsRepository.create(carAvailables[i]);

    const cars = await listAvailableCarsService.execute({
      name: createdCar.name,
    });

    expect(cars).toEqual([createdCar]);
  });

  it('should be able to list all available cars by brand', async () => {
    let createdCar: Car;

    for (let i = 0; i < carAvailables.length; i += 1)
      // eslint-disable-next-line no-await-in-loop
      createdCar = await carsRepository.create(carAvailables[i]);

    const cars = await listAvailableCarsService.execute({
      brand: createdCar.brand,
    });

    expect(cars).toEqual([createdCar]);
  });

  it('should be able to list all available cars by category_id', async () => {
    let createdCar: Car;

    for (let i = 0; i < carAvailables.length; i += 1)
      // eslint-disable-next-line no-await-in-loop
      createdCar = await carsRepository.create(carAvailables[i]);

    const cars = await listAvailableCarsService.execute({
      category_id: createdCar.category_id,
    });

    expect(cars).toEqual([createdCar]);
  });

  it('should not be able to list when category_id was not a valid uuid', () => {
    expect(async () => {
      await listAvailableCarsService.execute({ category_id: '1234' });
    }).rejects.toBeInstanceOf(AppError);
  });
});
