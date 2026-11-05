import { CustomError } from "../utils/errors.js";

export class CategoriesService {
    constructor(categoriesModel) {
        this.categoriesModel = categoriesModel;
    }

    async getAllCategories() {
        const categories = await this.categoriesModel.getAllCategories();
        return categories;
    }

    async createCategory(type) {
        // Verificar campos vacíos o espacios en blanco 
        if (!type || typeof type !== 'string' || !type.trim()) {
            throw new CustomError(400, 'El campo de la categoría no puede estar vacío');
        }

        const cleanType = type.trim();

        if (await this.categoryExistsByName(cleanType)) {
            throw new CustomError(400, 'La categoría ya existe');
        }

        const newCategory = await this.categoriesModel.createCategory(cleanType);
        return newCategory;
    }

    async createCategory(category_name) {
        if (await this.categoryExistsByName(category_name)) {
            throw new CustomError(400, 'La categoría ya existe');
        }

        const newCategory = await this.categoriesModel.createCategory(category_name);
        return newCategory;
    }

    async updateCategory(id, category_name) {
        // Verificar campos vacíos o espacios en blanco 
        if (!category_name || typeof category_name !== 'string' || !category_name.trim()) {
            throw new CustomError(400, 'El campo de la categoría no puede estar vacío');
        }

        const cleanCategoryName = category_name.trim();

        // 1. Verificar si la categoría existe
        if (!await this.categoryExistsById(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }

        // 2. Validación de duplicados usando el nombre limpio
        const existingMatches = await this.categoriesModel.findCategoryMatches(cleanCategoryName, true);
        if (existingMatches.length > 0) {
            const conflictRecord = existingMatches.find(item => item.id !== Number(id));
            if (conflictRecord) {
                throw new CustomError(400, 'Ya existe otra categoría con este nombre');
            }
        }

        // 3. Proceder a actualizar con el nombre limpio
        const updatedCategory = await this.categoriesModel.updateCategory(id, cleanCategoryName);
        return updatedCategory;
    }

    async deleteCategory(id) {
        // 1. Verificar si la categoría existe
        if (!await this.categoryExistsById(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }

        // 2. Desvincular de la tabla solutions
        await this.categoriesModel.removeCategoryFromSolutions(id);

        // 3. Proceder a eliminar
        const deletedCategory = await this.categoriesModel.deleteCategory(id);
        return deletedCategory;
    }

    async categoryExistsByName(category_name) {
        const categoryExists = await this.categoriesModel.findCategoryMatches(category_name, true);
        return !!categoryExists.length;
    }

    async categoryExistsById(id) {
        const categoryExists = await this.categoriesModel.getCategoryById(id);
        return !!categoryExists.length;
    }
}