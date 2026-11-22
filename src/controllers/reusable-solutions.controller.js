import ReusableSolutionsService from '../services/reusable-solutions.service.js';
import { CustomError } from '../utils/errors.js';
import { resSuccess } from '../utils/res-success.js';
export class ReusableSolutionsController {
    constructor(reusableSolutionsModel, tagsService, technologiesService) {
        this.reusableSolutionsService = new ReusableSolutionsService(reusableSolutionsModel, tagsService, technologiesService);
    };

    getAllReusableSolutions = async (req, res) => {
        const { pagination, filters = {}, sort = {} } = req.body ?? {};
        
        const reusableSolutions = await this.reusableSolutionsService.getAllReusableSolutions(pagination, filters, sort);
        resSuccess(res, reusableSolutions);
    };

    getReusableSolutionsByUser = async (req, res) => {
        const { id } = req.user;
        const { pagination, filters = {}, sort = {} } = req.body ?? {};
        
        const reusableSolutions = await this.reusableSolutionsService.getReusableSolutionsUser(id, pagination, filters, sort);
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
        const { id }       = req.user;
        
        const newSolution = await this.reusableSolutionsService.createReusableSolution({...solutionData, created_by: id});
        resSuccess(res, newSolution, 201);

    };

    updateReusableSolution = async (req, res) => {
        const { id }         = req.params;
        const { id: userId } = req.user;
        const solutionData   = req.body;
        
        const updatedSolution = await this.reusableSolutionsService.updateReusableSolution(id, {...solutionData, update_by: userId});
        resSuccess(res, updatedSolution);
    };

    deleteReusableSolution = async (req, res) => {
        const { id } = req.params;
        
        const deletedSolution = await this.reusableSolutionsService.deleteReusableSolution(id);
        resSuccess(res, deletedSolution);
    };
};