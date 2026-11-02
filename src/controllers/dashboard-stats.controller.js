import { resSuccess } from "../utils/res-success.js";

export class DashboardStatsController {
    constructor(dashboardStatsModel) {
        this.dashboardStatsModel = dashboardStatsModel;
    };

    getDashboardStats = async (req, res) => {
        const dashboardStats = await this.dashboardStatsModel.getDashboardStats();
        
        resSuccess(res, dashboardStats);
    };
};