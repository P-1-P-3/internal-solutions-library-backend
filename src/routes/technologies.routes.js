import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { TechnologiesController } from '../controllers/technologies.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const technologiesRoutes = (technologiesModel) => {
    const router = express.Router();

    const technologiesController = new TechnologiesController(technologiesModel);

    router.get('/', auth, authorize(1, 2), catchError(technologiesController.getAllTechnologies));
    router.post('/', auth, authorize(1), catchError(technologiesController.createTechnology));
    router.put('/:id', auth, authorize(1), catchError(technologiesController.updateTechnology));
    router.delete('/:id', auth, authorize(1), catchError(technologiesController.deleteTechnology));

    return router;
};