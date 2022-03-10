import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  private rentals: Rental[];

  constructor() {
    this.rentals = [];
  }

  async findActiveRentalByUser(user_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => !rental.end_date && rental.user_id === user_id,
    );

    return rental;
  }

  async findActiveRentalByCar(car_id: string): Promise<Rental> {
    const rental = this.rentals.find(
      rental => !rental.end_date && rental.car_id === car_id,
    );

    return rental;
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      car_id,
      user_id,
      start_date: new Date(),
      end_date: null,
      expected_return_date,
      total: null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }
}

export { RentalsRepositoryInMemory };
