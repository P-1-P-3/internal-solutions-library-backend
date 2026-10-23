import { TagsService } from "../services/tags.service.js";
import { resSuccess } from "../utils/res-success.js";

export class TagsController {
    constructor(tagsModel) {
        this.tagsService = new TagsService(tagsModel);
    };

    getAllTags = async (req, res) => {
        const tags = await this.tagsService.getAllTags();
        resSuccess(res, tags);
    };

    findTagMatches = async (req, res) => {
        const { tag_name, check } = req.query;
        const exactMatch = ['true', 'on', '1'].includes(String(check).toLowerCase());

        const tags = await this.tagsService.findTagMatches(tag_name, exactMatch);
        resSuccess(res, tags);
    };

    createTag = async (req, res) => {
        const { tag_name } = req.body;

        const newTag = await this.tagsService.createTag(tag_name);
        resSuccess(res, newTag, 201);
    };

    updateTag = async (req, res) => {
        const { id } = req.params;
        const { tag_name } = req.body;
        
        const updatedTag = await this.tagsService.updateTag(id, tag_name);
        resSuccess(res, updatedTag);
    };

    deleteTag = async (req, res) => {
        const { id } = req.params;
        
        const deletedTag = await this.tagsService.deleteTag(id);
        resSuccess(res, deletedTag);
    };
};