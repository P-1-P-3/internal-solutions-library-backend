import connection from "../../config/mysql.js";

export class FunctionalAreasModel {

    static async getFunctionalAreaById(id) {
        try {
            const [row] = await connection.query('SELECT * FROM functional_areas WHERE id = ?', [id]);
            return row;
        } catch (error) {
            console.error('Error al recuperar área funcional de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async getAllFunctionalAreas() {
        try {
            const [rows] = await connection.query('SELECT * FROM functional_areas');
            return rows;
        } catch (error) {
            console.error('Error al recuperar áreas funcionales de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async findFunctionalAreaMatches(functional_area, exactMatch = false) {
        try {
            const query = exactMatch
                ? 'SELECT * FROM functional_areas WHERE functional_area = ?'
                : 'SELECT * FROM functional_areas WHERE functional_area LIKE ?';
            const params = exactMatch ? [functional_area] : [`%${functional_area}%`];
            const [rows] = await connection.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error al buscar áreas funcionales en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async createFunctionalArea(functional_area) {
        try {
            const [result] = await connection.query('INSERT INTO functional_areas (functional_area) VALUES (?)', [functional_area]);
            return result;
        } catch (error) {
            console.error('Error al crear área funcional en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async updateFunctionalArea(id, functional_area) {
        try {
            const [result] = await connection.query('UPDATE functional_areas SET functional_area = ? WHERE id = ?', [functional_area, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar área funcional en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async deleteFunctionalArea(id) {
        try {
            const [result] = await connection.query('DELETE FROM functional_areas WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error al eliminar área funcional de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async removeFunctionalAreaFromSolutions(idFunctionalArea) {
        try {
            const [result] = await connection.query('UPDATE solutions SET id_functional_area = NULL WHERE id_functional_area = ?', [idFunctionalArea]);
            return result;
        } catch (error) {
            console.error('Error al desvincular el área funcional de las soluciones:', error);
            throw new Error('Error interno del servidor');
        }
    }
}