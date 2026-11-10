import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { UsersController } from '../controllers/users.controller.js';

export const usersRoutes = (usersModel) => {
    const router = express.Router();

    const usersController = new UsersController(usersModel);

    router.get('/:id', catchError(usersController.getUser));
    router.post('/', catchError(usersController.createUser));
    router.put('/:id', catchError(usersController.updateUser));
    router.delete('/:id', catchError(usersController.deleteUser));

    return router;
};