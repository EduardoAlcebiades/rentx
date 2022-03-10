import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsService } from './ListAvailableCarsService';

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, brand, category_id } = request.query;

    const listAvailableCarsService = container.resolve(
      ListAvailableCarsService,
    );

    const cars = await listAvailableCarsService.execute({
      name: name as string,
      brand: brand as string,
      category_id: category_id as string,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
