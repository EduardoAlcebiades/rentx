import { parse } from 'csv-parse';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '../../../../shared/container/providers/StorageProvider/IStorageProvider';
import { ICreateCategoryDTO } from '../../dtos/ICreateCategoryDTO';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

@injectable()
class ImportCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  private loadCategories(
    file: Express.Multer.File,
  ): Promise<ICreateCategoryDTO[]> {
    return new Promise((resolve, reject) => {
      const categories: ICreateCategoryDTO[] = [];
      const stream = fs.createReadStream(file.path);
      const parseFile = parse();

      stream.pipe(parseFile);

      parseFile
        .on('data', async line => {
          const [name, description] = line;

          categories.push({
            name,
            description,
          });
        })
        .on('end', async () => {
          fs.promises.unlink(file.path);

          resolve(categories);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.forEach(async ({ name, description }) => {
      const categoryAlreadyExists = await this.categoriesRepository.findByName(
        name,
      );

      if (!categoryAlreadyExists)
        this.categoriesRepository.create({ name, description });
    });
  }
}

export { ImportCategoriesService };
