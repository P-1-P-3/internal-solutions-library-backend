import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { CategoriesController } from '../controllers/categories.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const categoriesRoutes = (CategoriesModel) => {
    const router = express.Router();
    const categoriesController = new CategoriesController(CategoriesModel);

    router.get('/', auth, authorize(1, 2), catchError(categoriesController.getAllCategories));
    router.get('/search', auth, authorize(1, 2), catchError(categoriesController.findCategoryMatches));
    router.post('/', auth, authorize(1), catchError(categoriesController.createCategory));
    router.put('/:id', auth, authorize(1), catchError(categoriesController.updateCategory));
    router.delete('/:id', auth, authorize(1), catchError(categoriesController.deleteCategory));

    return router;
};