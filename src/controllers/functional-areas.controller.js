import { FunctionalAreasService } from "../services/functional-areas.service.js";
import { resSuccess } from "../utils/res-success.js";
import { CustomError } from "../utils/errors.js";

export class FunctionalAreasController {
    constructor(functionalAreasModel) {
        this.functionalAreasService = new FunctionalAreasService(functionalAreasModel);
    }

    getAllFunctionalAreas = async (req, res) => {
        const functionalAreas = await this.functionalAreasService.getAllFunctionalAreas();
        resSuccess(res, functionalAreas);
    }

    findFunctionalAreaMatches = async (req, res) => {
        const { functional_area, check } = req.query;
        const exactMatch = ['true', 'on', '1'].includes(String(check).toLowerCase());

        const functionalAreas = await this.functionalAreasService.findFunctionalAreaMatches(functional_area, exactMatch);
        resSuccess(res, functionalAreas);
    }

    createFunctionalArea = async (req, res) => {
        const { functional_area } = req.body;

        if (!functional_area || typeof functional_area !== 'string' || !functional_area.trim()) {
            throw new CustomError(400, 'El campo del área funcional no puede estar vacío');
        }

        const newFunctionalArea = await this.functionalAreasService.createFunctionalArea(functional_area.trim());
        resSuccess(res, newFunctionalArea, 201);
    }

    updateFunctionalArea = async (req, res) => {
        const { id } = req.params;
        const { functional_area } = req.body;
        
        const updatedFunctionalArea = await this.functionalAreasService.updateFunctionalArea(id, functional_area);
        resSuccess(res, updatedFunctionalArea);
    }

    deleteFunctionalArea = async (req, res) => {
        const { id } = req.params;
        
        const deletedFunctionalArea = await this.functionalAreasService.deleteFunctionalArea(id);
        resSuccess(res, deletedFunctionalArea);
    }
}