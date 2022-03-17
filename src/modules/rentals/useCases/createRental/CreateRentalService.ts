import { inject, injectable } from 'tsyringe';
import { validate } from 'uuid';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../../accounts/repositories/IUsersRepository';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

@injectable()
class CreateRentalService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({
    expected_return_date,
    car_id,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const minHoursToEndRental = 24;

    if (!validate(car_id)) throw new AppError('car_id is not a valid uuid');
    if (!validate(user_id)) throw new AppError('user_id is not a valid uuid');

    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) throw new AppError('User not found', 404);

    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) throw new AppError('Car not found', 404);

    const activeRentalByUser =
      await this.rentalsRepository.findActiveRentalByUser(user_id);

    if (activeRentalByUser)
      throw new AppError('User alredy has an active rental', 409);

    const activeRentalByCar =
      await this.rentalsRepository.findActiveRentalByCar(car_id);

    if (activeRentalByCar)
      throw new AppError('Car already has an active rental', 409);

    const currentDate = this.dateProvider.currentDate();
    const compare = this.dateProvider.compareInHours(
      currentDate,
      expected_return_date,
    );

    if (compare < minHoursToEndRental)
      throw new AppError(
        'expected_return_date need to be greater than 24 hours',
      );

    const rental = await this.rentalsRepository.create({
      expected_return_date,
      car_id,
      user_id,
    });

    await this.carsRepository.turnAvailable(car_id, false);

    return rental;
  }
}

export { CreateRentalService };
