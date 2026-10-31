//Receive HTTP data
import { CategoriesService } from "../services/categories.service.js";
import { resSuccess } from "../utils/res-success.js";

export class CategoriesController {
    constructor(categoriesModel) {
        this.categoriesService = new CategoriesService(categoriesModel);
    }

    getAllCategories = async (req, res) => {
        const categories = await this.categoriesService.getAllCategories();
        resSuccess(res, categories);
    }

    findCategoryMatches = async (req, res) => {
        const { category_name, check } = req.query;
        const exactMatch = ['true', 'on', '1'].includes(String(check).toLowerCase());

        const categories = await this.categoriesService.findCategoryMatches(category_name, exactMatch);
        resSuccess(res, categories);
    }

    createCategory = async (req, res) => {
        const { category_name } = req.body;

        const newCategory = await this.categoriesService.createCategory(category_name);
        resSuccess(res, newCategory, 201);
    }

    updateCategory = async (req, res) => {
        const { id } = req.params;
        const { category_name } = req.body;
        
        const updatedCategory = await this.categoriesService.updateCategory(id, category_name);
        resSuccess(res, updatedCategory);
    }

    deleteCategory = async (req, res) => {
        const { id } = req.params;
        
        const deletedCategory = await this.categoriesService.deleteCategory(id);
        resSuccess(res, deletedCategory);
    }
}
