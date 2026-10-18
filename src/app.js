import express from 'express';
import { createServer } from 'node:http';

export const app = () => {
    const app = express();
    const server = createServer(app);

    const port = process.env.PORT || 3000;

    app.disable('x-powered-by');

    app.use(express.json());

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};