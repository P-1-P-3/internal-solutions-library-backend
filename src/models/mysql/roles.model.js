import connection from "../../config/mysql.js";

export class RolesModel {
    static async getRoles() {
        try {
            const [rows] = await connection.query('SELECT id, name, description FROM roles');
            return rows;
        } catch (error) {
            console.error('Error al recuperar roles de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };
};