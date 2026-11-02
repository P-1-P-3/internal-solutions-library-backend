export default class ReusableSolutionsService {
    constructor(reusableSolutionsModel, tagsService, technologiesService) {
        this.reusableSolutionsModel = reusableSolutionsModel;
        this.tagsService            = tagsService;
        this.technologiesService    = technologiesService;
    };

    async getAllReusableSolutions(pagination, filters = {}, sort = {}) {
        const reusableSolutions = await this.reusableSolutionsModel.getAllReusableSolutions(pagination, filters, sort);
        
        const solutionsIds = reusableSolutions.map((solution) => solution.id);

        const technologiesBySolutionId = await this.technologiesService.getTechnologiesByIdSolution(solutionsIds);
        const tagsBySolutionId         = await this.tagsService.getTagsByIdSolution(solutionsIds);
        
        const resusableSolutionsFinal = reusableSolutions.map((solution) => {
            const solutionTechnologies = technologiesBySolutionId.filter((tech) => tech.id_solution === solution.id);
            const solutionTags         = tagsBySolutionId.filter((tag) => tag.id_solution === solution.id);

            return {
                ...solution,
                technologies: solutionTechnologies,
                tags: solutionTags,
            }
        });

        return [...resusableSolutionsFinal];
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