import express from 'express';
import { createServer } from 'node:http';
import { resusableSolutionsRoutes } from './routes/reusable-solutions.routes.js';
import { tagsRoutes } from './routes/tags.routes.js';
import { resError } from './middlewares/resError.js';

export const app = (reusableSolutionsModel, tagsModel) => {
    const app = express();
    const server = createServer(app);

    const port = process.env.PORT || 3000;

    app.disable('x-powered-by');

    app.use(express.json());
    app.use('/api/reusable-solutions', resusableSolutionsRoutes(reusableSolutionsModel, tagsModel));
    app.use('/api/tags', tagsRoutes(tagsModel));

    app.use(resError);

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};