import { CustomError } from "../utils/errors.js";

export class CategoriesService {
    constructor(categoriesModel) {
        this.categoriesModel = categoriesModel;
    }

    async getAllCategories() {
        const categories = await this.categoriesModel.getAllCategories();
        return categories;
    }

    async findCategoryMatches(category_type, exactMatch = false) {
        const categories = await this.categoriesModel.findCategoryMatches(category_type, exactMatch);
        return categories;
    }

    async createCategory(category_type) {
        if (await this.categoryTypeExists(category_type)) {
            throw new CustomError(400, 'La categoría ya existe');
        }

        const newCategory = await this.categoriesModel.createCategory(category_type);
        return newCategory;
    }

    async updateCategory(id, category_type) {
        if (!await this.categoryExists(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }
        const updatedCategory = await this.categoriesModel.updateCategory(id, category_type);
        return updatedCategory;
    }

    async deleteCategory(id) {
        // Verificar si la categoría existe
        if (!await this.categoryExistsById(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }

        // Validación: verificar si está asociada a alguna solución
        if (await this.categoryAssignedToSolutions(id)) {
            throw new CustomError(400, 'No es posible eliminar la categoría, asegúrese de que no esté asociada a alguna solución');
        }

        // Proceder a eliminar si pasa las validaciones
        const deletedCategory = await this.categoriesModel.deleteCategory(id);
        return deletedCategory;
    }

    async categoryTypeExists(category_type) {
        const categoryExists = await this.categoriesModel.findCategoryMatches(category_type, true);
        return !!categoryExists.length;
    }

    async categoryExists(id) {
        const categoryExists = await this.categoriesModel.getCategoryById(id);
        return !!categoryExists.length;
    }
}