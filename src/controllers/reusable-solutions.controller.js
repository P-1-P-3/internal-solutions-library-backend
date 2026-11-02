import ReusableSolutionsService from '../services/reusable-solutions.service.js';
import { CustomError } from '../utils/errors.js';
import { resSuccess } from '../utils/res-success.js';
export class ReusableSolutionsController {
    constructor(reusableSolutionsModel, tagsService, technologiesService) {
        this.reusableSolutionsService = new ReusableSolutionsService(reusableSolutionsModel, tagsService, technologiesService);
    };

    getAllReusableSolutions = async (req, res) => {
        const { pagination, filters = {} } = req.body ?? {};
        
        const reusableSolutions = await this.reusableSolutionsService.getAllReusableSolutions(pagination, filters);
        resSuccess(res, reusableSolutions);
    };

    getReusableSolutionById = async (req, res) => {
        const { id } = req.params;

        const reusableSolution = await this.reusableSolutionsService.getReusableSolutionById(id);
        if (reusableSolution) {
            resSuccess(res, reusableSolution);
        } else {
            throw new CustomError(404, 'Solución no encontrada')
        }
    };

    createReusableSolution = async (req, res) => {
        const solutionData = req.body;
        
        const newSolution = await this.reusableSolutionsService.createReusableSolution(solutionData);
        resSuccess(res, newSolution, 201);

    };

    updateReusableSolution = async (req, res) => {
        const { id } = req.params;
        const solutionData = req.body;
        
        const updatedSolution = await this.reusableSolutionsService.updateReusableSolution(id, solutionData);
        resSuccess(res, updatedSolution);
    };

    deleteReusableSolution = async (req, res) => {
        const { id } = req.params;
        
        const deletedSolution = await this.reusableSolutionsService.deleteReusableSolution(id);
        resSuccess(res, deletedSolution);
    };
};