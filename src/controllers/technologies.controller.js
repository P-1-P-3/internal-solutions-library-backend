import { TechnologiesService } from "../services/technologies.service.js";
import { resSuccess } from "../utils/res-success.js";

export class TechnologiesController {
    constructor(technologiesModel) {
        this.technologiesService = new TechnologiesService(technologiesModel);
    };

    getAllTechnologies = async (req, res) => {
        const technologies = await this.technologiesService.getAllTechnologies();
        resSuccess(res, technologies);
    };

    createTechnology = async (req, res) => {
        const { technology_name } = req.body;

        const newTechnology = await this.technologiesService.createTechnology(technology_name);
        resSuccess(res, newTechnology, 201);
    };

    updateTechnology = async (req, res) => {
        const { id } = req.params;
        const { technology_name } = req.body;
        
        const updatedTechnology = await this.technologiesService.updateTechnology(id, technology_name);
        resSuccess(res, updatedTechnology);
    };

    deleteTechnology = async (req, res) => {
        const { id } = req.params;
        
        const deletedTechnology = await this.technologiesService.deleteTechnology(id);
        resSuccess(res, deletedTechnology);
    };
};