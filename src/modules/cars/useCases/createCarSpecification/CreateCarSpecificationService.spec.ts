import { v4 as uuidV4 } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { ICreateSpecificationDTO } from '../../dtos/ICreateSpecificationDTO';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../repositories/inMemory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '../../repositories/inMemory/SpecificationsRepositoryInMemory';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';
import { CreateCarSpecificationService } from './CreateCarSpecificationService';

let createCarSpecificationService: CreateCarSpecificationService;
let carsRepository: ICarsRepository;
let specificationsRepository: ISpecificationsRepository;

describe('Create Car Specification', () => {
  const car: ICreateCarDTO = {
    name: 'Sample name',
    description: 'Sample description',
    daily_rate: 100,
    license_plate: 'ABC-1234',
    fine_amount: 60,
    brand: 'Sample brand',
    category_id: uuidV4(),
  };

  const specification: ICreateSpecificationDTO = {
    name: 'Sample name',
    description: 'Sample description',
  };

  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createCarSpecificationService = new CreateCarSpecificationService(
      carsRepository,
      specificationsRepository,
    );
  });

  it('sould be able to add a new specification in the car', async () => {
    const createdCar = await carsRepository.create(car);
    const createdSpecification = await specificationsRepository.create(
      specification,
    );

    const car_id = createdCar.id;
    const specificationIds = [createdSpecification.id];

    const createdCarSpecification = await createCarSpecificationService.execute(
      {
        car_id,
        specificationIds,
      },
    );

    expect(createdCarSpecification.id).toBe(car_id);
    expect(createdCarSpecification.specifications).toMatchObject(
      specificationIds.map(id => ({ id })),
    );
  });

  it('should not be able to add a new specification in a non existing car', async () => {
    const car_id = uuidV4();
    const specificationIds = [uuidV4()];

    expect.assertions(3);

    try {
      await createCarSpecificationService.execute({ car_id, specificationIds });
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(404);
    }
  });

  it('should not be able to add a new specification in the car when the car_id was a not valid uuid', async () => {
    const car_id = '1234';
    const specificationIds = [uuidV4()];

    expect.assertions(3);

    try {
      await createCarSpecificationService.execute({ car_id, specificationIds });
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(400);
    }
  });

  it('should not be able to add a new specification in the car when the specificationIds contains a not valid uuid', async () => {
    const car_id = uuidV4();
    const specificationIds = [uuidV4(), '4321', uuidV4()];

    expect.assertions(3);

    try {
      await createCarSpecificationService.execute({ car_id, specificationIds });
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(400);
    }
  });
});
