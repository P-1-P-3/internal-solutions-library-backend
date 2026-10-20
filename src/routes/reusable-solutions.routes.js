import express from 'express';
import { ReusableSolutionsController } from '../controllers/reusable-solutions.controller.js';
import { catchError } from '../utils/catch-error.js';

export const resusableSolutionsRoutes = (reusableSolutionsModel) => {
    const router = express.Router();

    const reusableSolutionsController = new ReusableSolutionsController(reusableSolutionsModel);

    router.get('/', catchError(reusableSolutionsController.getAllReusableSolutions));
    router.get('/:id', catchError(reusableSolutionsController.getReusableSolutionById));
    router.post('/', catchError(reusableSolutionsController.createReusableSolution));
    router.put('/:id', catchError(reusableSolutionsController.updateReusableSolution));
    router.delete('/:id', catchError(reusableSolutionsController.deleteReusableSolution));

    return router;
};