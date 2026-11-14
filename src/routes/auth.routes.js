import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { AuthController } from '../controllers/auth.controller.js';
import { auth, purposeMidd } from '../middlewares/auth.js';

export const authRoutes = (usersModel) => {
    const router = express.Router();
    const authController = new AuthController(usersModel);

    router.post('/login', catchError(authController.login));
    router.post('/logout', auth, catchError(authController.logout));
    router.post('/refresh', catchError(authController.refresh));
    router.post('/password-changed', purposeMidd, auth, catchError(authController.passwordChange));
    router.get('/me', auth, catchError(authController.me));

    return router;
};