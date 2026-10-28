import cors from 'cors';

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const corsMiddleware = cors({ origin: allowedOrigins, methods: ["GET", "POST", "PUT", "DELETE"] });