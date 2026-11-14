import { DashboardStatsService } from "../services/dashboard-stats.service.js";
import { resSuccess } from "../utils/res-success.js";

export class DashboardStatsController {
    constructor(dashboardStatsModel) {
        this.dashboardStatsService = new DashboardStatsService(dashboardStatsModel);
    };

    getDashboardStats = async (req, res) => {
        const dashboardStats = await this.dashboardStatsService.getDashboardStats();
        
        resSuccess(res, dashboardStats);
    };

    getStatCount = async (req, res) => {
        const dashboardStats = await this.dashboardStatsService.getDashboardStats();
        
        resSuccess(res, {
            solutionsCount: dashboardStats.solutionsCount,
            categoriesCount: dashboardStats.categoriesCount,
            technologiesCount: dashboardStats.technologiesCount, 
        });
    };
};