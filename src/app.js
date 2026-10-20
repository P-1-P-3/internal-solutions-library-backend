import express from 'express';
import { createServer } from 'node:http';
import { resusableSolutionsRoutes } from './routes/reusable-solutions.routes.js';

export const app = (reusableSolutionsModel) => {
    const app = express();
    const server = createServer(app);

    const port = process.env.PORT || 3000;

    app.disable('x-powered-by');

    app.use(express.json());
    app.use('/api/reusable-solutions', resusableSolutionsRoutes(reusableSolutionsModel));

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};