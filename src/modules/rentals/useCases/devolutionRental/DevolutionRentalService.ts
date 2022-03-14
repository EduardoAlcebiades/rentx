import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  rental_id: string;
}

@injectable()
class DevolutionRentalService {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ rental_id }: IRequest): Promise<Rental> {
    const minDaily = 1;
    const minDelay = 0;

    const rental = await this.rentalsRepository.findById(rental_id);

    if (!rental) throw new AppError('Rental not found', 404);

    if (rental.end_date)
      throw new AppError('This Rental already has been returned');

    const car = await this.carsRepository.findById(rental.car_id);

    const currentDate = this.dateProvider.currentDate();

    let daily = this.dateProvider.compareInDays(rental.start_date, currentDate);
    let delay = this.dateProvider.compareInDays(
      rental.expected_return_date,
      currentDate,
    );

    // Total of daily and delay in days
    daily = Math.max(daily, minDaily);
    delay = Math.max(delay, minDelay);

    // Total of daily and delay in money
    const totalDaily = daily * car.daily_rate;
    const totalDelay = delay * car.fine_amount;

    rental.total = totalDaily + totalDelay;
    rental.end_date = currentDate;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.turnAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalService };
