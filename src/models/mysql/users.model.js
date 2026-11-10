import connection from "../../config/mysql.js";
import { randomUUID } from "node:crypto";

export class UsersModel {
    static async getUser(id) {
        try {
            const [row] = await connection.query(`
                SELECT 
                    BIN_TO_UUID(u.id) AS id,
                    u.full_name,
                    u.email,
                    u.is_active,
                    u.must_change_password,
                    u.creation_date,
                    u.update_date,
                    JSON_OBJECT('id', u.role_id, 'name', r.name) AS role
                FROM users AS u
                INNER JOIN roles AS r
                    ON r.id = u.role_id
                WHERE u.id = UUID_TO_BIN(?)
            `, [id]);

            return row[0] || null;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async userEmailExists(email) {
        try {
            const [row] = await connection.query(
                'SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS email_exists',
                [email]
            );

            return Boolean(row[0].email_exists);
        } catch (error) {
            console.error('Error al validar email del usuario en base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async createUser(user) {
        try {
            const id = randomUUID();
            await connection.query(
                'INSERT INTO users (id, full_name, email, password, role_id, is_active, must_change_password, created_by) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))',
                [
                    id,
                    user.full_name,
                    user.email,
                    user.password,
                    user.role_id,
                    user.is_active,
                    user.must_change_password,
                    user.created_by ?? null,
                ]);

            const row = await this.getUser(id);
                
            if (!row) {
                throw new Error('No se pudo recuperar la solución creada');
            }
            
            return row;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async updateUser(id, userData) {
        try {
            const fields = [
                'full_name = ?',
                'email = ?',
                'role_id = ?',
                'is_active = ?',
                'must_change_password = ?',
                'update_by = UUID_TO_BIN(?)',
            ];
            const values = [
                userData.full_name,
                userData.email,
                userData.role_id,
                userData.is_active,
                userData.must_change_password,
                userData.update_by ?? null,
            ];

            if (userData.password !== undefined) {
                fields.splice(2, 0, 'password = ?');
                values.splice(2, 0, userData.password);
            }

            const [row] = await connection.query(
                `UPDATE users SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
                [...values, id]
            );

            return row;
        } catch (error) {
            console.error('Error al editar usuario:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async deleteUser(id) {
        try {
            const [row] = await connection.query('DELETE FROM users WHERE id = UUID_TO_BIN(?)', [id]);
            return row;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw new Error('Error interno del servidor');
        }
    };
};