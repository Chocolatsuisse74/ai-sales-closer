import express, { Router, Request, Response } from 'express';
import { Deal } from '../../types/index.js';
import { logger } from '../../utils/logger.js';

const router: Router = express.Router();

const dealsDB: Map<string, Deal> = new Map();

router.get('/', (_req: Request, res: Response) => {
  const deals = Array.from(dealsDB.values());
  res.json({ deals, count: deals.length });
});

router.get('/:id', (req: Request, res: Response) => {
  const deal = dealsDB.get(req.params.id);
  if (!deal) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  res.json(deal);
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { leadId, amount, stage, expectedClosureDate } = req.body;

    if (!leadId || !amount || !stage) {
      res
        .status(400)
        .json({ error: 'leadId, amount, and stage are required' });
      return;
    }

    const id = `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const deal: Deal = {
      id,
      leadId,
      amount,
      stage,
      expectedClosureDate: new Date(expectedClosureDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dealsDB.set(id, deal);
    logger.info({ dealId: id, leadId }, 'Deal created');
    res.status(201).json(deal);
  } catch (error) {
    logger.error(error, 'Error creating deal');
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const deal = dealsDB.get(req.params.id);
    if (!deal) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const updated = { ...deal, ...req.body, updatedAt: new Date() };
    dealsDB.set(req.params.id, updated);
    logger.info({ dealId: req.params.id }, 'Deal updated');
    res.json(updated);
  } catch (error) {
    logger.error(error, 'Error updating deal');
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = dealsDB.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  logger.info({ dealId: req.params.id }, 'Deal deleted');
  res.json({ success: true });
});

export default router;
