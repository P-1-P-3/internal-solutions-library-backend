import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { TechnologiesController } from '../controllers/technologies.controller.js';

export const technologiesRoutes = (technologiesModel) => {
    const router = express.Router();

    const technologiesController = new TechnologiesController(technologiesModel);

    router.get('/', catchError(technologiesController.getAllTechnologies));
    router.post('/', catchError(technologiesController.createTechnology));
    router.put('/:id', catchError(technologiesController.updateTechnology));
    router.delete('/:id', catchError(technologiesController.deleteTechnology));

    return router;
};