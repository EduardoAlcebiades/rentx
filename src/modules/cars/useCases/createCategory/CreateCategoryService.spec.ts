import { validate } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateCategoryDTO } from '../../dtos/ICreateCategoryDTO';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';
import { CategoriesRepositoryInMemory } from '../../repositories/inMemory/CategoriesRepositoryInMemory';
import { CreateCategoryService } from './CreateCategoryService';

let createCategoryService: CreateCategoryService;
let categoriesRepository: ICategoriesRepository;

describe('Create Category', () => {
  const category: ICreateCategoryDTO = {
    name: 'Sample name',
    description: 'Sample description',
  };

  beforeEach(() => {
    categoriesRepository = new CategoriesRepositoryInMemory();
    createCategoryService = new CreateCategoryService(categoriesRepository);
  });

  it('should be able to create a new category', async () => {
    await createCategoryService.execute(category);

    const categories = await categoriesRepository.list();
    const createdCategory = await categoriesRepository.findByName(
      category.name,
    );

    expect(categories).toMatchObject([category]);
    expect(createdCategory).toHaveProperty('created_at');
    expect(validate(createdCategory.id)).toBe(true);
  });

  it('should not be able to create multiple categories with the same name', async () => {
    await createCategoryService.execute(category);

    expect.assertions(3);

    try {
      await createCategoryService.execute(category);
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(409);
    }
  });
});
