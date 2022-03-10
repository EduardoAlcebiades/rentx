import dayjs from 'dayjs';
import { v4 as uuidV4 } from 'uuid';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../../accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../../accounts/repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../../accounts/repositories/IUsersRepository';
import { ICreateCarDTO } from '../../../cars/dtos/ICreateCarDTO';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '../../../cars/repositories/inMemory/CarsRepositoryInMemory';
import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { RentalsRepositoryInMemory } from '../../repositories/InMemory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { CreateRentalService } from './CreateRentalService';

let createRentalService: CreateRentalService;
let rentalsRepository: IRentalsRepository;
let usersRepository: IUsersRepository;
let carsRepository: ICarsRepository;
let expected_return_date: Date;
let dayjsDateProvider: IDateProvider;

describe('Create Rental', () => {
  const user: ICreateUserDTO = {
    name: 'Sample Name',
    email: 'sample@email.com',
    password: '1234',
    driver_license: '123456abcd',
  };
  const car: ICreateCarDTO = {
    name: 'Sample name',
    description: 'Sample description',
    daily_rate: 100,
    license_plate: 'ABC-1234',
    fine_amount: 60,
    brand: 'Sample brand',
  };

  beforeEach(() => {
    expected_return_date = dayjs().add(1, 'day').toDate();

    dayjsDateProvider = new DayjsDateProvider();
    rentalsRepository = new RentalsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    createRentalService = new CreateRentalService(
      rentalsRepository,
      usersRepository,
      carsRepository,
      dayjsDateProvider,
    );
  });

  it('should be able to create a new rental', async () => {
    const createdUser = await usersRepository.create(user);
    const createdCar = await carsRepository.create(car);
    const rental: ICreateRentalDTO = {
      expected_return_date,
      car_id: createdCar.id,
      user_id: createdUser.id,
    };

    const createdRental = await createRentalService.execute(rental);

    expect(createdRental.car_id).toBe(createdCar.id);
    expect(createdRental.user_id).toBe(createdUser.id);
    expect(createdRental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental when the car_id was a not valid uuid', async () => {
    const createdUser = await usersRepository.create(user);
    const rental: ICreateRentalDTO = {
      expected_return_date,
      car_id: '1234',
      user_id: createdUser.id,
    };

    expect(async () => {
      await createRentalService.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the user_id was a not valid uuid', async () => {
    const createdCar = await carsRepository.create(car);
    const rental: ICreateRentalDTO = {
      expected_return_date,
      car_id: createdCar.id,
      user_id: '1234',
    };

    expect(async () => {
      await createRentalService.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when user does not exist', async () => {
    const createdCar = await carsRepository.create(car);
    const rental: ICreateRentalDTO = {
      expected_return_date,
      car_id: createdCar.id,
      user_id: uuidV4(),
    };

    expect(async () => {
      await createRentalService.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when car does not exist', async () => {
    const createdUser = await usersRepository.create(user);
    const rental: ICreateRentalDTO = {
      expected_return_date,
      car_id: uuidV4(),
      user_id: createdUser.id,
    };

    expect(async () => {
      await createRentalService.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the car already has one rental active', async () => {
    const createdCar = await carsRepository.create(car);
    const createdUser1 = await usersRepository.create({
      ...user,
      email: 'sample1@email.com',
    });

    await createRentalService.execute({
      expected_return_date,
      car_id: createdCar.id,
      user_id: createdUser1.id,
    });

    const createdUser2 = await usersRepository.create({
      ...user,
      email: 'sample2@email.com',
    });

    expect(async () => {
      await createRentalService.execute({
        expected_return_date,
        car_id: createdCar.id,
        user_id: createdUser2.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the user already has one rental active', async () => {
    const createdCar1 = await carsRepository.create({
      ...car,
      license_plate: 'ABC-1234',
    });
    const createdUser = await usersRepository.create(user);

    await createRentalService.execute({
      expected_return_date,
      car_id: createdCar1.id,
      user_id: createdUser.id,
    });

    const createdCar2 = await carsRepository.create({
      ...car,
      license_plate: 'ABC-4321',
    });

    expect(async () => {
      await createRentalService.execute({
        expected_return_date,
        car_id: createdCar2.id,
        user_id: createdUser.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when expect_return_date was less than 24 hours', async () => {
    const createdUser = await usersRepository.create(user);
    const createdCar = await carsRepository.create(car);
    const rental: ICreateRentalDTO = {
      expected_return_date: dayjs().toDate(),
      car_id: createdCar.id,
      user_id: createdUser.id,
    };

    expect(async () => {
      await createRentalService.execute(rental);
    }).rejects.toBeInstanceOf(AppError);
  });
});
