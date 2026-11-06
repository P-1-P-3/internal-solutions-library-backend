import express from 'express';
import { ReusableSolutionsController } from '../controllers/reusable-solutions.controller.js';
import { catchError } from '../utils/catch-error.js';
import { TagsService } from '../services/tags.service.js';
import { TechnologiesService } from '../services/technologies.service.js';

export const resusableSolutionsRoutes = (reusableSolutionsModel, tagsModel, technologiesModel) => {
    const router = express.Router();

    const tagsService                 = new TagsService(tagsModel);
    const technologiesService         = new TechnologiesService(technologiesModel);
    const reusableSolutionsController = new ReusableSolutionsController(reusableSolutionsModel, tagsService, technologiesService);

    router.post('/search', catchError(reusableSolutionsController.getAllReusableSolutions));
    router.get('/:id', catchError(reusableSolutionsController.getReusableSolutionById));
    router.post('/', catchError(reusableSolutionsController.createReusableSolution));
    router.put('/:id', catchError(reusableSolutionsController.updateReusableSolution));
    router.delete('/:id', catchError(reusableSolutionsController.deleteReusableSolution));

    return router;
};