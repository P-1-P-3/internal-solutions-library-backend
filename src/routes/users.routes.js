import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { UsersController } from '../controllers/users.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const usersRoutes = (usersModel) => {
    const router = express.Router();

    const usersController = new UsersController(usersModel);

    router.get('/:id', auth, authorize(1), catchError(usersController.getUser));
    router.post('/', auth, authorize(1), catchError(usersController.createUser));
    router.put('/:id', auth, authorize(1), catchError(usersController.updateUser));
    router.delete('/:id', auth, authorize(1), catchError(usersController.deleteUser));

    return router;
};