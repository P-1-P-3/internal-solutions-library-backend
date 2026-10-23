import { CustomError } from "../utils/errors.js";

export class TechnologiesService {
    constructor(technologiesModel) {
        this.technologiesModel = technologiesModel;
    };

    async getAllTechnologies() {
        const technologies = await this.technologiesModel.getAllTechnologies();
        return technologies;
    };

    // async findTechnologyMatches(technology_name, exactMatch = false) {
    //     const technologies = await this.technologiesModel.findTechnologyMatches(technology_name, exactMatch);
    //     return technologies;
    // };

    async createTechnology(technology_name) {
        if (await this.technologyNameExists(technology_name)) {
            throw new CustomError(400, 'La tecnología ya existe');
        }

        const newTechnology = await this.technologiesModel.createTechnology(technology_name);
        return newTechnology;
    };

    async updateTechnology(id, technology_name) {
        if (!await this.technologyExists(id)) {
            throw new CustomError(400, 'No existe la tecnología');
        }

        const updatedTechnology = await this.technologiesModel.updateTechnology(id, technology_name);
        return updatedTechnology;
    };

    async deleteTechnology(id) {
        if (!await this.technologyExists(id)) {
            throw new CustomError(400, 'No existe la tecnología');
        }

        await this.technologiesModel.removeTechnologyFromAllSolutions(id);
        const deletedTechnology = await this.technologiesModel.deleteTechnology(id);
        return deletedTechnology;
    };

    async technologyNameExists (technology_name) {
        const technologyExists = await this.technologiesModel.findTechnologyMatches(technology_name, true);

        return !!technologyExists.length;
    };

    async technologyExists (id) {
        const technologyExists = await this.technologiesModel.getTechnologyById(id);

        return !!technologyExists.length;
    };

    // * Funcionalidades de tags asociadas a soluciones reutilizables
    async getTechnologiesByIdSolution(idSolution) {
        const tags = await this.technologiesModel.getTechnologiesByIdSolution(idSolution);
        return tags;
    };

    async associateTechnologiesWithSolution(idSolution, idTechnologies) {
        if (!Array.isArray(idTechnologies))
            throw new CustomError(400, 'Technologies debe ser una lista');

        if (idTechnologies.length === 0)
            return null;

        const associationResult = await this.technologiesModel.createTechnologyForSolution(idSolution, idTechnologies);
        return associationResult;
    };

    async removeTechnologiesFromSolution(idSolution, idTechnologies) {
        if (!Array.isArray(idTechnologies)) {
            throw new TypeError('Technologies debe ser una lista');
        }

        if (idTechnologies.length === 0) {
            return { affectedRows: 0 };
        }

        const removalResult = await this.technologiesModel.removeTechnologiesFromSolution(idSolution, idTechnologies);
        return removalResult;
    };

    async removeAllTechnologiesFromSolution(idSolution) {
        const removalResult = await this.technologiesModel.removeAllTechnologiesFromSolution(idSolution);
        return removalResult;
    };

    async technologyExistsInSolution(idTechnology, idSolution) {
        const technologyExists = await this.technologiesModel.getTechnologyByIdSolution(idTechnology, idSolution);

        return !!technologyExists.length;
    };
};