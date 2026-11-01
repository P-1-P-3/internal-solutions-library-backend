import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { FunctionalAreasController } from '../controllers/functional-areas.controller.js';

export const functionalAreasRoutes = (FunctionalAreasModel) => {
    const router = express.Router();
    const functionalAreasController = new FunctionalAreasController(FunctionalAreasModel);

    router.get('/', catchError(functionalAreasController.getAllFunctionalAreas));
    router.get('/search', catchError(functionalAreasController.findFunctionalAreaMatches));
    router.post('/', catchError(functionalAreasController.createFunctionalArea));
    router.put('/:id', catchError(functionalAreasController.updateFunctionalArea));
    router.delete('/:id', catchError(functionalAreasController.deleteFunctionalArea));

    return router;
};