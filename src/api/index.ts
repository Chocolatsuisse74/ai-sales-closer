import express from 'express';
import agentsRouter from './routes/agents.js';
import leadsRouter from './routes/leads.js';
import dealsRouter from './routes/deals.js';
import { logger } from '../utils/logger.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/agents', agentsRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/deals', dealsRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(
    (err: unknown, _req: express.Request, res: express.Response) => {
      logger.error(err, 'Unhandled error');
      res.status(500).json({ error: 'Internal server error' });
    }
  );

  return app;
}

export async function startServer(port: number = 3000) {
  const app = createApp();
  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      resolve();
    });
  });
}
