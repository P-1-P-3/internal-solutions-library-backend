import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { DashboardStatsController } from '../controllers/dashboard-stats.controller.js';

export const dashboardStatsRoutes = (dashboardStatsModel) => {
    const router = express.Router();

    const dashboardStatsController = new DashboardStatsController(dashboardStatsModel);

    router.get('/stats', catchError(dashboardStatsController.getDashboardStats));

    return router;
};