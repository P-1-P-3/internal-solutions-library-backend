import express from 'express';
import { catchError } from '../utils/catch-error.js';
import { TagsController } from '../controllers/tags.controller.js';
import { auth, authorize } from '../middlewares/auth.js';

export const tagsRoutes = (TagsModel) => {
    const router = express.Router();

    const tagsController = new TagsController(TagsModel);

    router.get('/', auth, authorize(1, 2), catchError(tagsController.getAllTags));
    router.get('/search', auth, authorize(1, 2), catchError(tagsController.findTagMatches));
    router.post('/', auth, authorize(1), catchError(tagsController.createTag));
    router.put('/:id', auth, authorize(1), catchError(tagsController.updateTag));
    router.delete('/:id', auth, authorize(1), catchError(tagsController.deleteTag));

    return router;
};