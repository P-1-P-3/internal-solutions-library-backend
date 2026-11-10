import express from 'express';
import { createServer } from 'node:http';
import { resusableSolutionsRoutes } from './routes/reusable-solutions.routes.js';
import { tagsRoutes } from './routes/tags.routes.js';
import { technologiesRoutes } from './routes/technologies.routes.js';
import { categoriesRoutes } from './routes/categories.routes.js';
import { functionalAreasRoutes } from './routes/functional-areas.routes.js';
import { resError } from './middlewares/resError.js';
import { corsMiddleware } from './middlewares/cors.js';
import { dashboardStatsRoutes } from './routes/dashboard-stats.routes.js';
import { usersRoutes } from './routes/users.routes.js';

export const app = (reusableSolutionsModel, tagsModel, technologiesModel, categoriesModel, functionalAreasModel, dashboardStatsModel, usersModel) => {
    const app = express();
    const server = createServer(app);

    const port = process.env.PORT || 3000;

    app.disable('x-powered-by');

    app.use(corsMiddleware);
    app.use(express.json());

    app.use('/api/reusable-solutions', resusableSolutionsRoutes(reusableSolutionsModel, tagsModel, technologiesModel));
    app.use('/api/tags', tagsRoutes(tagsModel));
    app.use('/api/technologies', technologiesRoutes(technologiesModel));
    app.use('/api/categories', categoriesRoutes(categoriesModel));
    app.use('/api/functional-areas', functionalAreasRoutes(functionalAreasModel));
    app.use('/api/dashboard', dashboardStatsRoutes(dashboardStatsModel));
    app.use('/api/users', usersRoutes(usersModel));

    app.use(resError);

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};