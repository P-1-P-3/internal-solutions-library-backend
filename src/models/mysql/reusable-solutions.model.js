import connection from "../../config/mysql.js";
import { randomUUID } from "node:crypto";

export class ReusableSolutionsModel {
    static async getAllReusableSolutions(pagination, filters = {}, sort = {}) {
        const { limit, offset } = pagination;
        const { title, categories, functionalAreas, technologies, tags } = filters;
        const { field, order = 'ASC' } = sort;

        const conditions = [];
        const params = [];
        const validSortFields = ['title', 'category', 'functional_area', 'repository_url', 'version', 'update_date'];

        if (title?.trim()) {
            conditions.push("s.title LIKE ?");
            params.push(`%${title.trim()}%`);
        }

        if (categories?.length) {
            conditions.push(`s.category IN (${categories.map(() => "?").join(", ")})`);
            params.push(...categories);
        }

        if (functionalAreas?.length) {
            conditions.push(`s.functional_area IN (${functionalAreas.map(() => "?").join(", ")})`);
            params.push(...functionalAreas);
        }

        if (technologies?.length) {
            conditions.push(`tech.id IN (${technologies.map(() => "?").join(", ")})`);
            params.push(...technologies);
        }

        if (tags?.length) {
            conditions.push(`t.id IN (${tags.map(() => "?").join(", ")})`);
            params.push(...tags);
        }

        const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

        const orderBy = validSortFields.includes(field)
            ? `ORDER BY s.${field} ${order}`
            : "ORDER BY s.title, s.id ASC";
        
        try {
            const [rows] = await connection.query(`
                SELECT
                    BIN_TO_UUID(s.id) AS id,
                    s.title,
                    s.description,
                    s.repository_url,
                    JSON_OBJECT('id', s.category, 'type', c.type) AS category,
                    JSON_OBJECT('id', s.functional_area, 'functional_area', f.functional_area ) AS functional_area
                FROM solutions AS s
                LEFT JOIN categories AS c 
                    ON c.id = s.category
                LEFT JOIN functional_areas AS f 
                    ON f.id = s.functional_area
                ${ where }
                ${ orderBy }
                LIMIT ? OFFSET ?
            `, [...params, limit, offset]);
            return rows;
        } catch (error) {
            console.error('Error fetching reusable solutions from database:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async getReusableSolutionById(id) {
        try {
            const [row] = await connection.query(`
                SELECT 
                    BIN_TO_UUID(s.id) AS id,
                    s.title,
                    s.description,
                    s.requirements,
                    s.implementation_example,
                    s.best_practices,
                    s.common_errors,
                    s.repository_url,
                    s.version,
                    s.update_date,
                    JSON_OBJECT('id', s.category, 'type', c.type) AS category,
                    JSON_OBJECT('id', s.functional_area, 'functional_area', f.functional_area ) AS functional_area
                FROM solutions AS s 
                INNER JOIN categories AS c
                    ON c.id = s.category
                INNER JOIN functional_areas AS f
                    ON f.id = s.functional_area
                WHERE s.id = UUID_TO_BIN(?)
            `, [id]);
            return row[0] || null;
        } catch (error) {
            console.error(`Error fetching reusable solution with ID ${id}:`, error);
            throw new Error('Error interno del servidor');
        }
    };

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