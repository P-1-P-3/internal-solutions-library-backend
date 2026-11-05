import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { CategoriesController } from '../controllers/categories.controller.js';

export const categoriesRoutes = (CategoriesModel) => {
    const router = express.Router();
    const categoriesController = new CategoriesController(CategoriesModel);

    router.get('/', catchError(categoriesController.getAllCategories));
    router.get('/search', catchError(categoriesController.findCategoryMatches));
    router.post('/', catchError(categoriesController.createCategory));
    router.put('/:id', catchError(categoriesController.updateCategory));
    router.delete('/:id', catchError(categoriesController.deleteCategory));

    return router;
};