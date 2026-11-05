import connection from "../../config/mysql.js";

export class TagsModel {

    static async getTagById(id) {
        try {
            const [row] = await connection.query('SELECT * FROM tags WHERE id = ?', [id]);
            return row;
        } catch (error) {
            console.error('Error al recuperar etiquetas de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async getAllTags() {
        try {
            const [rows] = await connection.query('SELECT * FROM tags');
            return rows;
        } catch (error) {
            console.error('Error al recuperar etiquetas de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async findTagMatches(tag_name, exactMatch = false) {
        try {
            const query = exactMatch
                ? 'SELECT * FROM tags WHERE tag = ?'
                : 'SELECT * FROM tags WHERE tag LIKE ?';
            const params = exactMatch ? [tag_name] : [`%${tag_name}%`];
            const [rows] = await connection.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error al recuperar etiquetas de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async createTag(tag_name) {
        try {
            const [result] = await connection.query('INSERT INTO tags (tag) VALUES (?)', [tag_name]);
            return result;
        } catch (error) {
            console.error('Error al crear etiqueta en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async updateTag(id, tag_name) {
        try {
            const [result] = await connection.query('UPDATE tags SET tag = ? WHERE id = ?', [tag_name, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar etiqueta en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async deleteTag(id) {
        try {
            const [result] = await connection.query('DELETE FROM tags WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error al eliminar etiqueta de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };
    
    // * Funcionalidades de tags asociadas a soluciones reutilizables
    static async getTagByIdSolution(idTag, idSolution) {
        try {
            const [rows] = await connection.query('SELECT * FROM solution_tags WHERE id_tag = ? AND id_solution = UUID_TO_BIN(?)', [idTag, idSolution]);
            return rows;
        } catch (error) {
            console.error('Error al recuperar etiquetas asociadas a la solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };
    
    static async getTagsByIdSolution(idSolution) {
        const placeholders = Array.isArray(idSolution) ? idSolution.map(() => 'UUID_TO_BIN(?)').join(', ') : 'UUID_TO_BIN(?)';

        try {
            const [rows] = await connection.query(`
                SELECT 
                    t.id AS id, 
                    t.tag AS tag,
                    BIN_TO_UUID(st.id_solution) AS id_solution
                FROM solution_tags AS st
                INNER JOIN tags AS t ON t.id = st.id_tag
                WHERE id_solution IN (${placeholders})`,
                Array.isArray(idSolution) ? idSolution.map((id) => id) : [idSolution]);
            return rows;
        } catch (error) {
            console.error('Error al recuperar etiquetas asociadas a la solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async createTagForSolution(idSolution, idTags) {
        const values = idTags
        .map(() => '(UUID_TO_BIN(?), ?)')
        .join(', ');

        const parameters = idTags.flatMap((id) => [idSolution, id]);
        
        try {
            const [result] = await connection.query(`INSERT INTO solution_tags (id_solution, id_tag) VALUES ${values}`, parameters);
            return result;
        } catch (error) {
            console.error('Error al crear etiqueta asociada a una solucion:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeTagsFromSolution(idSolution, idTags) {
        const placeholders = idTags.map(() => '?').join(', ');

        try {
            const [result] = await connection.query(
                `DELETE FROM solution_tags
                WHERE id_solution = UUID_TO_BIN(?)
                AND id_tag IN (${placeholders})`,
                [idSolution, ...idTags]
            );

            return result;
        } catch (error) {
            console.error('Error al eliminar etiquetas asociadas a una solución:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeAllTagsFromSolution(idSolution) {
        try {
            const [result] = await connection.query('DELETE FROM solution_tags WHERE id_solution = UUID_TO_BIN(?)', [idSolution]);
            return result;
        } catch (error) {
            console.error('Error al eliminar todas las etiquetas asociadas a una solución:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async removeTagFromAllSolutions(idTag) {
        try {
            const [result] = await connection.query('DELETE FROM solution_tags WHERE id_tag = ?', [idTag]);
            return result;
        } catch (error) {
            console.error('Error al eliminar etiqueta asociada en todas las soluciónes:', error);
            throw new Error('Error interno del servidor');
        }
    };

};