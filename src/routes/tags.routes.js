import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { TagsController } from '../controllers/tags.controller.js';

export const tagsRoutes = (TagsModel) => {
    const router = express.Router();

    const tagsController = new TagsController(TagsModel);

    router.get('/', catchError(tagsController.getAllTags));
    router.get('/search', catchError(tagsController.findTagMatches));
    router.post('/', catchError(tagsController.createTag));
    router.put('/:id', catchError(tagsController.updateTag));
    router.delete('/:id', catchError(tagsController.deleteTag));

    return router;
};