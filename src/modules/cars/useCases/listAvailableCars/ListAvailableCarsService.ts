import { inject, injectable } from 'tsyringe';
import { validate } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { Car } from '../../infra/typeorm/entities/Car';
import { ICarsRepository } from '../../repositories/ICarsRepository';

interface IRequest {
  name?: string;
  brand?: string;
  category_id?: string;
}

@injectable()
class ListAvailableCarsService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) {}

  async execute({ name, brand, category_id }: IRequest): Promise<Car[]> {
    if (category_id && !validate(category_id))
      throw new AppError('category_id is not a valid uuid!');

    const cars = this.carsRepository.findAllAvailable(name, brand, category_id);

    return cars;
  }
}

export { ListAvailableCarsService };
