import { CustomError } from "../utils/errors.js";

export class TagsService {
    constructor(tagsModel) {
        this.tagsModel = tagsModel;
    };

    async getAllTags() {
        const tags = await this.tagsModel.getAllTags();
        return tags;
    };

    async findTagMatches(tag_name, exactMatch = false) {
        const tags = await this.tagsModel.findTagMatches(tag_name, exactMatch);
        return tags;
    };

    async createTag(tag_name) {
        if (await this.tagNameExists(tag_name)) {
            throw new CustomError(400, 'La etiqueta ya existe');
        }

        const newTag = await this.tagsModel.createTag(tag_name);
        return newTag;
    };

    async updateTag(id, tag_name) {
        if (!await this.tagExists(id)) {
            throw new CustomError(400, 'No existe la etiqueta');
        }

        const updatedTag = await this.tagsModel.updateTag(id, tag_name);
        return updatedTag;
    };

    async deleteTag(id) {
        if (!await this.tagExists(id)) {
            throw new CustomError(400, 'No existe la etiqueta');
        }

        const deletedTag = await this.tagsModel.deleteTag(id);
        return deletedTag;
    };

    async tagNameExists (tag_name) {
        const tagExists = await this.tagsModel.findTagMatches(tag_name, true);

        return !!tagExists.length;
    };

    async tagExists (id) {
        const tagExists = await this.tagsModel.getTagById(id);

        return !!tagExists.length;
    };

    // * Funcionalidades de tags asociadas a soluciones reutilizables
    async getTagsByIdSolution(idSolution) {
        const tags = await this.tagsModel.getTagsByIdSolution(idSolution);
        return tags;
    };

    async associateTagsWithSolution(idSolution, idTags) {
        if (!Array.isArray(idTags))
            throw new CustomError(400, 'Tags debe ser una lista');

        if (idTags.length === 0)
            return null;

        const associationResult = await this.tagsModel.createTagForSolution(idSolution, idTags);
        return associationResult;
    };

    async removeTagsFromSolution(idSolution, idTags) {
        if (!Array.isArray(idTags)) {
            throw new TypeError('Tags debe ser una lista');
        }

        if (idTags.length === 0) {
            return { affectedRows: 0 };
        }

        const removalResult = await this.tagsModel.removeTagsFromSolution(idSolution, idTags);
        return removalResult;
    };

    async removeAllTagsFromSolution(idSolution) {
        const removalResult = await this.tagsModel.removeAllTagsFromSolution(idSolution);
        return removalResult;
    };

    async tagExistsInSolution(idTag, idSolution) {
        const tagExists = await this.tagsModel.getTagByIdSolution(idTag, idSolution);

        return !!tagExists.length;
    };
};