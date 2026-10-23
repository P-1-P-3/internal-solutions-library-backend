export default class ReusableSolutionsService {
    constructor(reusableSolutionsModel, tagsService) {
        this.reusableSolutionsModel = reusableSolutionsModel;
        this.tagsService            = tagsService;
    };

    async getAllReusableSolutions() {
        const reusableSolutions = await this.reusableSolutionsModel.getAllReusableSolutions();

        const solutionsById = new Map();

        for (const row of reusableSolutions) {
            let solution = solutionsById.get(row.id);

            if (!solution) {
                const { tag_id, tag_name,...solutionData } = row;

                solution = { ...solutionData, tags: [] };
                solutionsById.set(row.id, solution);
            }

            if (row.tag_id !== null)
                solution.tags.push({ id: row.tag_id, tag: row.tag_name });
        }

        return [...solutionsById.values()];
    };

    async getReusableSolutionById(id) {
        const reusableSolution = await this.reusableSolutionsModel.getReusableSolutionById(id);

        if (!reusableSolution) return null;

        const tags = await this.tagsService.getTagsByIdSolution(id);
        return {...reusableSolution, tags};
    };

    async createReusableSolution({tags, technologies, ...solutionData}) {
        const newSolution = await this.reusableSolutionsModel.createReusableSolution(solutionData);

        if (newSolution?.id && tags.length > 0) {
            await this.tagsService.associateTagsWithSolution(newSolution.id, tags);
        }
        // TODO: Crear lógica para asociar technologies con la nueva solución reutilizable

        return {...newSolution, tags, technologies};
    };

    async updateReusableSolution(id, {tags, technologies, ...solutionData}) {
        const updatedSolution = await this.reusableSolutionsModel.updateReusableSolution(id, solutionData);
        const tagResults = { new: null, remove: null };

        if (tags?.new?.length > 0) {
            tagResults.new = await this.tagsService.associateTagsWithSolution(id, tags.new);
        }

        if (tags?.remove?.length > 0) {
            tagResults.remove = await this.tagsService.removeTagsFromSolution(id, tags.remove);
        }
        // TODO: Crear lógica para actualizar tags y technologies asociados con la solución reutilizable
        return {solution: updatedSolution, tags: tagResults};
    };

    async deleteReusableSolution(id) {
        const removeAllTags   = await this.tagsService.removeAllTagsFromSolution(id);
        const deletedSolution = await this.reusableSolutionsModel.deleteReusableSolution(id);
        // TODO: Crear lógica para eliminar technologies asociados con la solución reutilizable

        return {solution: deletedSolution, tags: removeAllTags};
    };
}; 