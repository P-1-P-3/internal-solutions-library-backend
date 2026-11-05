//Recive http
import { CategoriesService } from "../services/categories.service.js";
import { resSuccess } from "../utils/res-success.js";
import { CustomError } from "../utils/errors.js";

export class CategoriesController {
    constructor(categoriesModel) {
        this.categoriesService = new CategoriesService(categoriesModel);
    }

    getAllCategories = async (req, res) => {
        const categories = await this.categoriesService.getAllCategories();
        resSuccess(res, categories);
    }

    findCategoryMatches = async (req, res) => {
        const { category_type, check } = req.query;
        const exactMatch = ['true', 'on', '1'].includes(String(check).toLowerCase());

        const categories = await this.categoriesService.findCategoryMatches(category_type, exactMatch);
        resSuccess(res, categories);
    }

    createCategory = async (req, res) => {
        // Obtenemos category_type (o type por si acaso)
        const category_type = req.body.category_type || req.body.type;

        // Validación estricta de campo vacío o espacios en blanco
        if (!category_type || typeof category_type !== 'string' || !category_type.trim()) {
            throw new CustomError(400, 'El campo de la categoría no puede estar vacío');
        }

        const newCategory = await this.categoriesService.createCategory(category_type.trim());
        resSuccess(res, newCategory, 201);
    }

    updateCategory = async (req, res) => {
        const { id } = req.params;
        const category_type = req.body.category_type || req.body.type;

        if (!category_type || typeof category_type !== 'string' || !category_type.trim()) {
            throw new CustomError(400, 'El campo de la categoría no puede estar vacío');
        }
        
        const updatedCategory = await this.categoriesService.updateCategory(id, category_type.trim());
        resSuccess(res, updatedCategory);
    }

    deleteCategory = async (req, res) => {
        const { id } = req.params;
        
        const deletedCategory = await this.categoriesService.deleteCategory(id);
        resSuccess(res, deletedCategory);
    }
}
