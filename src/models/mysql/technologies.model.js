import connection from "../../config/mysql.js";

export class TechnologiesModel {
    
    static async getTechnologyById(id) {
        try {
            const [row] = await connection.query('SELECT * FROM technologies WHERE id = ?', [id]);
            return row;
        } catch (error) {
            console.error('Error al recuperar la tecnología de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async getAllTechnologies() {
        try {
            const [rows] = await connection.query('SELECT * FROM technologies');
            return rows;
        } catch (error) {
            console.error('Error al recuperar todas las tecnologías de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async findTechnologyMatches(technology_name, exactMatch = false) {
        try {
            const query = exactMatch
                ? 'SELECT * FROM technologies WHERE technology = ?'
                : 'SELECT * FROM technologies WHERE technology LIKE ?';
            const params = exactMatch ? [technology_name] : [`%${technology_name}%`];
            const [rows] = await connection.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error al recuperar coincidencia de tecnologías de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async createTechnology(technology_name) {
        try {
            const [result] = await connection.query('INSERT INTO technologies (technology) VALUES (?)', [technology_name]);
            return result;
        } catch (error) {
            console.error('Error al crear tecnología en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async updateTechnology(id, technology_name) {
        try {
            const [result] = await connection.query('UPDATE technologies SET technology = ? WHERE id = ?', [technology_name, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar tecnología en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async deleteTechnology(id) {
        try {
            const [result] = await connection.query('DELETE FROM technologies WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error al eliminar tecnología de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };
    
    // * Funcionalidades de tecnologías asociadas a soluciones reutilizables
    static async getTechnologyByIdSolution(idTechnology, idSolution) {
        try {
            const [rows] = await connection.query('SELECT * FROM solution_technologies WHERE id_technology = ? AND id_solution = UUID_TO_BIN(?)', [idTechnology, idSolution]);
            return rows;
        } catch (error) {
            console.error('Error al recuperar tecnología asociada a la solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };
    
    static async getTechnologiesByIdSolution(idSolution) {
        try {
            const [rows] = await connection.query(`
                SELECT 
                    t.id AS id, 
                    t.technology AS technology 
                FROM solution_technologies AS st
                INNER JOIN technologies AS t ON t.id = st.id_technology
                WHERE id_solution = UUID_TO_BIN(?)`,
                [idSolution]);
            return rows;
        } catch (error) {
            console.error('Error al recuperar tecnologías asociadas a la solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async createTechnologyForSolution(idSolution, idTechnologies) {
        const values = idTechnologies
        .map(() => '(UUID_TO_BIN(?), ?)')
        .join(', ');

        const parameters = idTechnologies.flatMap((id) => [idSolution, id]);
        
        try {
            const [result] = await connection.query(`INSERT INTO solution_technologies (id_solution, id_technology) VALUES ${values}`, parameters);
            return result;
        } catch (error) {
            console.error('Error al asociar tecnologia con una solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeTechnologiesFromSolution(idSolution, idTechnologies) {
        const placeholders = idTechnologies.map(() => '?').join(', ');

        try {
            const [result] = await connection.query(
                `DELETE FROM solution_technologies
                WHERE id_solution = UUID_TO_BIN(?)
                AND id_technology IN (${placeholders})`,
                [idSolution, ...idTechnologies]
            );

            return result;
        } catch (error) {
            console.error('Error al eliminar tecnologías asociadas a una solución:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeAllTechnologiesFromSolution(idSolution) {
        try {
            const [result] = await connection.query('DELETE FROM solution_technologies WHERE id_solution = UUID_TO_BIN(?)', [idSolution]);
            return result;
        } catch (error) {
            console.error('Error al eliminar todas las tecnologías asociadas a una solución:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeTechnologyFromAllSolutions(id_technology) {
        try {
            const [result] = await connection.query('DELETE FROM solution_technologies WHERE id_technology = ?', [id_technology]);
            return result;
        } catch (error) {
            console.error('Error al eliminar la tecnología asociadas en todas las soluciónes:', error);
            throw new Error('Error interno del servidor');
        }
    };

};