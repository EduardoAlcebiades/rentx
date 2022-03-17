import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../../../config/upload';
import { CreateCategoryController } from '../../../../modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoriesController } from '../../../../modules/cars/useCases/importCategories/ImportCategoriesController';
import { ListCategoriesController } from '../../../../modules/cars/useCases/listCategories/ListCategoriesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureIsAdmin } from '../middlewares/ensureIsAdmin';

const categoriesRoutes = Router();
const upload = multer({ storage: uploadConfig.storage });

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoriesController = new ImportCategoriesController();

categoriesRoutes.get('/', listCategoriesController.handle);
categoriesRoutes.post(
  '/',
  ensureAuthenticated,
  ensureIsAdmin,
  createCategoryController.handle,
);
categoriesRoutes.post(
  '/import',
  ensureAuthenticated,
  ensureIsAdmin,
  upload.single('file'),
  importCategoriesController.handle,
);

export { categoriesRoutes };
