import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { DashboardStatsController } from '../controllers/dashboard-stats.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const dashboardStatsRoutes = (dashboardStatsModel) => {
    const router = express.Router();

    const dashboardStatsController = new DashboardStatsController(dashboardStatsModel);

    router.get('/stats', auth, authorize(1, 2), catchError(dashboardStatsController.getDashboardStats));
    router.get('/stat-count', catchError(dashboardStatsController.getStatCount));

    return router;
};