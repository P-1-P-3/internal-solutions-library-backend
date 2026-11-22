import { CustomError } from '../utils/errors.js';

export default class ReusableSolutionsService {
    constructor(reusableSolutionsModel, tagsService, technologiesService) {
        this.reusableSolutionsModel = reusableSolutionsModel;
        this.tagsService            = tagsService;
        this.technologiesService    = technologiesService;
    };

    async getAllReusableSolutions(pagination = {}, filters = {}, sort = {}) {
        if (!pagination || typeof pagination !== 'object' || Array.isArray(pagination)) {
            throw new CustomError(400, 'La paginación debe ser un objeto válido.');
        }

        const pageSize = Number(pagination.pageSize ?? pagination.limit ?? 10);
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
            throw new CustomError(400, 'La cantidad por página debe ser un entero entre 1 y 100.');
        }

        const offset = pagination.page === undefined && pagination.offset !== undefined
            ? Number(pagination.offset)
            : null;

        if (offset !== null && (!Number.isInteger(offset) || offset < 0)) {
            throw new CustomError(400, 'El desplazamiento debe ser un entero no negativo.');
        }

        const page = Number(pagination.page ?? (
            offset === null ? 1 : Math.floor(offset / pageSize) + 1
        ));

        if (!Number.isInteger(page) || page < 1) {
            throw new CustomError(400, 'El número de página debe ser un entero positivo.');
        }

        const modelPagination = { page, pageSize };
        if (offset !== null) modelPagination.offset = offset;

        const { rows: reusableSolutions, totalItems, page: currentPage } =
            await this.reusableSolutionsModel.getAllReusableSolutions(
                modelPagination,
                filters,
                sort
            );
        
        const solutionsIds = reusableSolutions.map((solution) => solution.id);
        let technologiesBySolutionId = [];
        let tagsBySolutionId         = [];

        if (solutionsIds.length > 0) {
            technologiesBySolutionId = await this.technologiesService.getTechnologiesByIdSolution(solutionsIds);
            tagsBySolutionId         = await this.tagsService.getTagsByIdSolution(solutionsIds);
        }
        
        const resusableSolutionsFinal = reusableSolutions.map((solution) => {
            const solutionTechnologies = technologiesBySolutionId.filter((tech) => tech.id_solution === solution.id);
            const solutionTags         = tagsBySolutionId.filter((tag) => tag.id_solution === solution.id);

            return {
                ...solution,
                technologies: solutionTechnologies,
                tags: solutionTags,
            }
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            items: resusableSolutionsFinal,
            pagination: {
                page: currentPage,
                pageSize,
                totalItems,
                totalPages,
                hasPrevious: currentPage > 1,
                hasNext: currentPage < totalPages,
            },
        };
    };

    async getReusableSolutionsUser(userId, pagination = {}, filters = {}, sort = {}) {
        if (!pagination || typeof pagination !== 'object' || Array.isArray(pagination))
            throw new CustomError(400, 'La paginación debe ser un objeto válido.');

        const pageSize = Number(pagination.pageSize ?? pagination.limit ?? 10);
        if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100)
            throw new CustomError(400, 'La cantidad por página debe ser un entero entre 1 y 100.');

        const offset = pagination.page === undefined && pagination.offset !== undefined
            ? Number(pagination.offset)
            : null;

        if (offset !== null && (!Number.isInteger(offset) || offset < 0))
            throw new CustomError(400, 'El desplazamiento debe ser un entero no negativo.');

        const page = Number(pagination.page ?? (
            offset === null ? 1 : Math.floor(offset / pageSize) + 1
        ));

        if (!Number.isInteger(page) || page < 1)
            throw new CustomError(400, 'El número de página debe ser un entero positivo.');

        const modelPagination = { page, pageSize };
        if (offset !== null) modelPagination.offset = offset;

        const { rows: reusableSolutions, totalItems, page: currentPage } =
            await this.reusableSolutionsModel.getReusableSolutionsUser(
                userId,
                modelPagination,
                filters,
                sort
            );
        
        const solutionsIds = reusableSolutions.map((solution) => solution.id);
        let technologiesBySolutionId = [];
        let tagsBySolutionId         = [];

        if (solutionsIds.length > 0) {
            technologiesBySolutionId = await this.technologiesService.getTechnologiesByIdSolution(solutionsIds);
            tagsBySolutionId         = await this.tagsService.getTagsByIdSolution(solutionsIds);
        }
        
        const resusableSolutionsFinal = reusableSolutions.map((solution) => {
            const solutionTechnologies = technologiesBySolutionId.filter((tech) => tech.id_solution === solution.id);
            const solutionTags         = tagsBySolutionId.filter((tag) => tag.id_solution === solution.id);

            return {
                ...solution,
                technologies: solutionTechnologies,
                tags: solutionTags,
            }
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            items: resusableSolutionsFinal,
            pagination: {
                page: currentPage,
                pageSize,
                totalItems,
                totalPages,
                hasPrevious: currentPage > 1,
                hasNext: currentPage < totalPages,
            },
        };
    };

    async getReusableSolutionById(id) {
        const reusableSolution = await this.reusableSolutionsModel.getReusableSolutionById(id);

        if (!reusableSolution) return null;

        const tags         = await this.tagsService.getTagsByIdSolution(id);
        const technologies = await this.technologiesService.getTechnologiesByIdSolution(id);

        return {...reusableSolution, tags, technologies};
    };

    async createReusableSolution({tags, technologies, ...solutionData}) {
        const newSolution = await this.reusableSolutionsModel.createReusableSolution(solutionData);

        if (newSolution?.id) {
            if (tags.length > 0)
                await this.tagsService.associateTagsWithSolution(newSolution.id, tags);

            if (technologies.length > 0)
                await this.technologiesService.associateTechnologiesWithSolution(newSolution.id, technologies);
        }

        return {...newSolution, tags, technologies};
    };

    async updateReusableSolution(id, {tags, technologies, ...solutionData}) {
        const updatedSolution = await this.reusableSolutionsModel.updateReusableSolution(id, solutionData);
        const tagResults        = { new: null, remove: null };
        const technologyResults = { new: null, remove: null };

        if (tags?.new?.length > 0)
            tagResults.new = await this.tagsService.associateTagsWithSolution(id, tags.new);

        if (tags?.remove?.length > 0)
            tagResults.remove = await this.tagsService.removeTagsFromSolution(id, tags.remove);

        if (technologies?.new?.length > 0)
            technologyResults.new = await this.technologiesService.associateTechnologiesWithSolution(id, technologies.new);

        if (technologies?.remove?.length > 0)
            technologyResults.remove = await this.technologiesService.removeTechnologiesFromSolution(id, technologies.remove);
        
        return {solution: updatedSolution, tags: tagResults, technologies: technologyResults};
    };

    async deleteReusableSolution(id) {
        const removeAllTags   = await this.tagsService.removeAllTagsFromSolution(id);
        const removeAllTech   = await this.technologiesService.removeAllTechnologiesFromSolution(id);
        const deletedSolution = await this.reusableSolutionsModel.deleteReusableSolution(id);

        return {solution: deletedSolution, tags: removeAllTags, technologies: removeAllTech};
    };
}; 