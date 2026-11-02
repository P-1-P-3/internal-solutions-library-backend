import connection from "../../config/mysql.js";

export class DashboardStatsModel {
    static async getDashboardStats() {
        try {
            const [totalsRows] = await connection.query(`
                SELECT
                    (SELECT COUNT(*) FROM solutions) AS solutionsCount,
                    (SELECT COUNT(*) FROM categories) AS categoriesCount,
                    (SELECT COUNT(*) FROM technologies) AS technologiesCount
            `);

            const [solutionsByCategory] = await connection.query(`
                SELECT
                    c.id AS id,
                    c.type AS type,
                    COUNT(s.id) AS solutionsCount
                FROM categories AS c
                LEFT JOIN solutions AS s 
                    ON s.category = c.id
                GROUP BY c.id
                ORDER BY c.id
            `);

            return { ...totalsRows[0], solutionsByCategory };
        } catch (error) {
            console.error('Error al obtener estadísticas del dashboard:', error);
            throw new Error('Error interno del servidor');
        }
    };
};