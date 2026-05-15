import express, { Router, Request, Response } from 'express';
import { AgentOrchestrator } from '../../agents/index.js';
import { logger } from '../../utils/logger.js';

const router: Router = express.Router();
const orchestrator = new AgentOrchestrator();

router.get('/', (_req: Request, res: Response) => {
  const agents = orchestrator.listAgents();
  res.json({
    agents,
    count: agents.length,
  });
});

router.post('/:agentId/message', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const agent = orchestrator.getAgent(agentId);
    if (!agent) {
      res.status(404).json({ error: `Agent ${agentId} not found` });
      return;
    }

    const response = await agent.process(message);
    res.json(response);
  } catch (error) {
    logger.error(error, 'Error processing agent message');
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

router.post('/lead-qualifier/qualify', async (req: Request, res: Response) => {
  try {
    const { lead } = req.body;
    const agent = orchestrator.getAgent('lead-qualifier');

    if (!agent) {
      res.status(404).json({ error: 'Lead qualifier agent not found' });
      return;
    }

    const response = await agent.process(JSON.stringify(lead));
    res.json(response);
  } catch (error) {
    logger.error(error, 'Error qualifying lead');
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
});

export default router;
