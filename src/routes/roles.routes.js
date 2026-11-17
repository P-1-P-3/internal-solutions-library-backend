import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { auth, authorize } from '../middlewares/auth.js';
import { RolesController } from '../controllers/roles.controller.js';

export const rolesRoutes = (rolesModel) => {
    const router = express.Router();

    const rolesController = new RolesController(rolesModel);
    //auth, authorize(1),
    router.get('/', catchError(rolesController.getRoles));

    return router;
};