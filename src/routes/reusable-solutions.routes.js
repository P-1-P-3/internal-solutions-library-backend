import express from 'express';
import { ReusableSolutionsController } from '../controllers/reusable-solutions.controller.js';
import { catchError } from '../utils/catch-error.js';
import { TagsService } from '../services/tags.service.js';
import { TechnologiesService } from '../services/technologies.service.js';
import { auth, authorize } from '../middlewares/auth.js';

export const resusableSolutionsRoutes = (reusableSolutionsModel, tagsModel, technologiesModel) => {
    const router = express.Router();

    const tagsService                 = new TagsService(tagsModel);
    const technologiesService         = new TechnologiesService(technologiesModel);
    const reusableSolutionsController = new ReusableSolutionsController(reusableSolutionsModel, tagsService, technologiesService);

    router.post('/search', auth, authorize(1, 2), catchError(reusableSolutionsController.getAllReusableSolutions));
    router.post('/user', auth, authorize(1, 2), catchError(reusableSolutionsController.getReusableSolutionsByUser));
    router.get('/:id', auth, authorize(1, 2), catchError(reusableSolutionsController.getReusableSolutionById));
    router.post('/', auth, authorize(1, 2), catchError(reusableSolutionsController.createReusableSolution));
    router.put('/:id', auth, authorize(1, 2), catchError(reusableSolutionsController.updateReusableSolution));
    router.delete('/:id', auth, authorize(1, 2), catchError(reusableSolutionsController.deleteReusableSolution));

    return router;
};