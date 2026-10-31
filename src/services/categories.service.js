import { CustomError } from "../utils/errors.js";

export class CategoriesService {
    constructor(categoriesModel) {
        this.categoriesModel = categoriesModel;
    }

    async getAllCategories() {
        const categories = await this.categoriesModel.getAllCategories();
        return categories;
    }

    async findCategoryMatches(category_name, exactMatch = false) {
        const categories = await this.categoriesModel.findCategoryMatches(category_name, exactMatch);
        return categories;
    }

    async createCategory(category_name) {
        if (await this.categoryNameExists(category_name)) {
            throw new CustomError(400, 'La categoría ya existe');
        }

        const newCategory = await this.categoriesModel.createCategory(category_name);
        return newCategory;
    }

    async updateCategory(id, category_name) {
        if (!await this.categoryExists(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }

        const updatedCategory = await this.categoriesModel.updateCategory(id, category_name);
        return updatedCategory;
    }

    async deleteCategory(id) {
        if (!await this.categoryExists(id)) {
            throw new CustomError(400, 'No existe la categoría');
        }

        // Si prefieres desvincular las soluciones antes de borrar la categoría
        await this.categoriesModel.removeCategoryFromSolutions(id);
        const deletedCategory = await this.categoriesModel.deleteCategory(id);
        return deletedCategory;
    }

    async categoryNameExists(category_name) {
        const categoryExists = await this.categoriesModel.findCategoryMatches(category_name, true);
        return !!categoryExists.length;
    }

    async categoryExists(id) {
        const categoryExists = await this.categoriesModel.getCategoryById(id);
        return !!categoryExists.length;
    }
}