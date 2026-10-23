import connection from "../../config/mysql.js";
import { randomUUID } from "node:crypto";

export class ReusableSolutionsModel {
    static async getAllReusableSolutions() {
        try {
            const [rows] = await connection.query(`
                SELECT
                    BIN_TO_UUID(s.id) AS id,
                    s.title,
                    s.description,
                    s.category,
                    s.functional_area,
                    s.repository_url,
                    t.id AS tag_id,
                    t.tag AS tag_name,
                    tech.id AS technology_id,
                    tech.technology AS technology_name
                FROM solutions AS s
                LEFT JOIN solution_tags AS st ON st.id_solution = s.id
                LEFT JOIN tags AS t ON t.id = st.id_tag
                LEFT JOIN solution_technologies AS sol_tech ON sol_tech.id_solution = s.id
                LEFT JOIN technologies AS tech ON tech.id = sol_tech.id_technology
                ORDER BY s.title, t.tag
            `);
            return rows;
        } catch (error) {
            console.error('Error fetching reusable solutions from database:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async getReusableSolutionById(id) {
        try {
            const [row] = await connection.query('SELECT *, BIN_TO_UUID(id) as id FROM solutions WHERE id = UUID_TO_BIN(?)', [id]);
            return row[0] || null;
        } catch (error) {
            console.error(`Error fetching reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    }

    static async createReusableSolution(solutionData) {
        try {
            const id = randomUUID();
            await connection.query(
                'INSERT INTO solutions (id, title, description, requirements, implementation_example, best_practices, common_errors, category, functional_area, repository_url, version) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    id,
                    solutionData.title,
                    solutionData.description,
                    solutionData.requirements,
                    solutionData.implementation_example,
                    solutionData.best_practices,
                    solutionData.common_errors,
                    solutionData.category,
                    solutionData.functional_area,
                    solutionData.repository_url,
                    solutionData.version
                ]);

            const [rows] = await connection.query(
                'SELECT *, BIN_TO_UUID(id) as id FROM solutions WHERE id = UUID_TO_BIN(?)',
                [id]
            );

            if (!rows[0]) {
                throw new Error('Created solution could not be retrieved');
            }
            
            return rows[0];
        } catch (error) {
            console.error('Error creating reusable solution:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async updateReusableSolution(id, solutionData) {
        try {
            const [row] = await connection.query(
                'UPDATE solutions SET title = ?, description = ?, requirements = ?, implementation_example = ?, best_practices = ?, common_errors = ?, category = ?, functional_area = ?, repository_url = ?, version = ? WHERE id = UUID_TO_BIN(?)',
                [
                    solutionData.title,
                    solutionData.description,
                    solutionData.requirements,
                    solutionData.implementation_example,
                    solutionData.best_practices,
                    solutionData.common_errors,
                    solutionData.category,
                    solutionData.functional_area,
                    solutionData.repository_url,
                    solutionData.version,
                    id
                ]);
            return row;
        } catch (error) {
            console.error(`Error updating reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };

    static async deleteReusableSolution(id) {
        try {
            const [row] = await connection.query('DELETE FROM solutions WHERE id = UUID_TO_BIN(?)', [id]);
            return row;
        } catch (error) {
            console.error(`Error deleting reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };
};