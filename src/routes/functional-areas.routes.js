import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { FunctionalAreasController } from '../controllers/functional-areas.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const functionalAreasRoutes = (FunctionalAreasModel) => {
    const router = express.Router();
    const functionalAreasController = new FunctionalAreasController(FunctionalAreasModel);

    router.get('/', auth, authorize(1, 2), catchError(functionalAreasController.getAllFunctionalAreas));
    router.get('/search', auth, authorize(1, 2), catchError(functionalAreasController.findFunctionalAreaMatches));
    router.post('/', auth, authorize(1), catchError(functionalAreasController.createFunctionalArea));
    router.put('/:id', auth, authorize(1), catchError(functionalAreasController.updateFunctionalArea));
    router.delete('/:id', auth, authorize(1), catchError(functionalAreasController.deleteFunctionalArea));

    return router;
};