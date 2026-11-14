import { randomUUID } from "node:crypto";
import connection from "../../config/mysql.js";

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

    static async getUserByEmail(email) {
        try {
            const [row] = await connection.query(`
                SELECT 
                    BIN_TO_UUID(u.id) AS id,
                    u.full_name,
                    u.email,
                    u.password,
                    u.is_active,
                    u.must_change_password,
                    JSON_OBJECT('id', u.role_id, 'name', r.name) AS role
                FROM users AS u
                INNER JOIN roles AS r
                    ON r.id = u.role_id
                WHERE u.email = ?
            `, [email]);

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
                `INSERT INTO users (
                    id,
                    full_name,
                    email,
                    password,
                    role_id,
                    is_active,
                    must_change_password,
                    created_by
                ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?))`,
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

    static async updatePassword(id, password, update_by) {
        try {
            const [result] = await connection.query(
                'UPDATE users SET must_change_password = ?, password = ?, update_by = ? WHERE id = UUID_TO_BIN(?)',
                [false, password, update_by, id]
            );
            return result;
        } catch (error) {
            console.error('Error al editar credenciales:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async updateLastLogin(id) {
        try {
            const [result] = await connection.query(
                'UPDATE users SET last_login = UTC_TIMESTAMP() WHERE id = UUID_TO_BIN(?)',
                [id]
            );
            return result;
        } catch (error) {
            console.error('Error al actualizar ultimo inicio de sesión:', error);
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

    // * REFRESH TOKEN
    static async createRefreshToken(data) {
        try {
            await connection.query(
                'INSERT INTO refresh_tokens (user_id, token_hash, expires_date) VALUES (UUID_TO_BIN(?), ?, ?)',
                [data.user_id, data.token_hash, data.expires_date]
            );
        } catch (error) {
            console.error('Error al crear refresh token en tabla:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async rotateRefreshToken(oldHash, userId, newToken) {
        const transaction = await connection.getConnection();
        let transactionStarted = false;

        try {
            await transaction.beginTransaction();
            transactionStarted = true;

            const [tokens] = await transaction.execute(
                `SELECT rt.id AS refresh_token_id, BIN_TO_UUID(rt.user_id) as id,
                        u.email, u.is_active, u.must_change_password,
                        JSON_OBJECT('id', u.role_id, 'name', r.name) AS role
                FROM refresh_tokens rt
                INNER JOIN users u ON u.id = rt.user_id
                INNER JOIN roles r ON r.id = u.role_id
                WHERE rt.token_hash = ?
                AND rt.revoked_date IS NULL
                AND rt.expires_date > UTC_TIMESTAMP()
                AND rt.user_id = UUID_TO_BIN(?)
                AND u.is_active = 1
                FOR UPDATE`,
                [oldHash, userId]
            );

            const currentToken = tokens[0];
            if (!currentToken) {
                await transaction.rollback();
                transactionStarted = false;
                return null;
            }

            const [revoked] = await transaction.execute(
                'UPDATE refresh_tokens SET revoked_date = UTC_TIMESTAMP() WHERE id = ? AND revoked_date IS NULL',
                [currentToken.refresh_token_id]
            );
            if (revoked.affectedRows !== 1) {
                await transaction.rollback();
                transactionStarted = false;
                return null;
            }

            await transaction.execute(
                'INSERT INTO refresh_tokens (user_id, token_hash, expires_date) VALUES (UUID_TO_BIN(?), ?, ?)',
                [currentToken.id, newToken.token_hash, newToken.expires_date]
            );

            await transaction.commit();
            transactionStarted = false;
            return currentToken;
        } catch (error) {
            if (transactionStarted)
                await transaction.rollback();
            console.error('Error al rotar refresh token:', error);
            throw new Error('Error interno del servidor');
        } finally {
            transaction.release();
        }
    };

    static async revokeRefreshToken(tokenHash) {
        try {
            await connection.execute(
                'UPDATE refresh_tokens SET revoked_date = UTC_TIMESTAMP() WHERE token_hash = ? AND revoked_date IS NULL',
                [tokenHash]
            );
        } catch (error) {
            console.error('Error al revocar refresh token:', error);
            throw new Error('Error interno del servidor');
        }
    };

    static async revokeRefreshTokensForUser(userId) {
        try {
            await connection.execute(
                'UPDATE refresh_tokens SET revoked_date = UTC_TIMESTAMP() WHERE user_id = UUID_TO_BIN(?) AND revoked_date IS NULL',
                [userId]
            );
        } catch (error) {
            console.error('Error al revocar refresh tokens del usuario:', error);
            throw new Error('Error interno del servidor');
        }
    };
};