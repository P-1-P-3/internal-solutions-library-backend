import connection from "../../config/mysql.js";

export class CategoriesModel {
    //Crear metodos
    static async getCategoryById(id) {
        try {
            const [row] = await connection.query('SELECT * FROM categories WHERE id = ?', [id]);
            return row;
        } catch (error) {
            console.error('Error al recuperar categoría de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async getAllCategories() {
        try {
            const [rows] = await connection.query('SELECT * FROM categories');
            return rows;
        } catch (error) {
            console.error('Error al recuperar categorías de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async findCategoryMatches(category_name, exactMatch = false) {
        try {
            const query = exactMatch
                ? 'SELECT * FROM categories WHERE type = ?'
                : 'SELECT * FROM categories WHERE type LIKE ?';
            const params = exactMatch ? [category_name] : [`%${category_name}%`];
            const [rows] = await connection.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error al buscar categorías en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async createCategory(category_name) {
        try {
            const [result] = await connection.query('INSERT INTO categories (type) VALUES (?)', [category_name]);
            return result;
        } catch (error) {
            console.error('Error al crear categoría en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async updateCategory(id, category_name) {
        try {
            const [result] = await connection.query('UPDATE categories SET type = ? WHERE id = ?', [category_name, id]);
            return result;
        } catch (error) {
            console.error('Error al actualizar categoría en la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async deleteCategory(id) {
        try {
            const [result] = await connection.query('DELETE FROM categories WHERE id = ?', [id]);
            return result;
        } catch (error) {
            console.error('Error al eliminar categoría de la base de datos:', error);
            throw new Error('Error interno del servidor');
        }
    }

    static async getSolutionsByCategoryId(id) {
        try {
            const [rows] = await connection.query('SELECT * FROM solutions WHERE id_category = ?', [id]);
            return rows;
        } catch (error) {
            console.error('Error al verificar soluciones asociadas a la categoría:', error);
            throw new Error('Error interno del servidor');
        }
    }
}