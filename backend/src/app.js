import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { env } from './config/env.js';
import { authOptional } from './middleware/authOptional.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(authOptional);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Career Compass API',
      docs: '/api/v1/health'
    });
  });

  app.use('/api/v1', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
