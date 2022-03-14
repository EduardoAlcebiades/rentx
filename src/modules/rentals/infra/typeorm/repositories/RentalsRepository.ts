import { EntityRepository, getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '../../../dtos/ICreateRentalDTO';
import { IRentalsRepository } from '../../../repositories/IRentalsRepository';
import { Rental } from '../entities/Rental';

@EntityRepository()
class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findById(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car'],
    });

    return rentals;
  }

  async findActiveRentalByUser(user_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({ user_id, end_date: null });

    return rental;
  }

  async findActiveRentalByCar(car_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({ car_id, end_date: null });

    return rental;
  }

  async create({
    id,
    car_id,
    expected_return_date,
    user_id,
    end_date,
    total,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      id,
      car_id,
      user_id,
      expected_return_date,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }
}

export { RentalsRepository };
