import express from 'express';
import { ReusableSolutionsController } from '../controllers/reusable-solutions.controller.js';
import { catchError } from '../utils/catch-error.js';
import { TagsService } from '../services/tags.service.js';

export const resusableSolutionsRoutes = (reusableSolutionsModel, tagsModel) => {
    const router = express.Router();

    const tagsService                 = new TagsService(tagsModel);
    const reusableSolutionsController = new ReusableSolutionsController(reusableSolutionsModel, tagsService);

    router.get('/', catchError(reusableSolutionsController.getAllReusableSolutions));
    router.get('/:id', catchError(reusableSolutionsController.getReusableSolutionById));
    router.post('/', catchError(reusableSolutionsController.createReusableSolution));
    router.put('/:id', catchError(reusableSolutionsController.updateReusableSolution));
    router.delete('/:id', catchError(reusableSolutionsController.deleteReusableSolution));

    return router;
};