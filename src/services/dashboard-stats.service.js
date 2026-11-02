export class DashboardStatsService {
    constructor(dashboardStatsModel) {
        this.dashboardStatsModel = dashboardStatsModel;
    };

    async getDashboardStats() {
        const dashboardStats = await this.dashboardStatsModel.getDashboardStats();
        return dashboardStats;
    };
};