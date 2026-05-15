import express, { Router, Request, Response } from 'express';
import { Lead } from '../../types/index.js';
import { logger } from '../../utils/logger.js';

const router: Router = express.Router();

const leadsDB: Map<string, Lead> = new Map();

router.get('/', (_req: Request, res: Response) => {
  const leads = Array.from(leadsDB.values());
  res.json({ leads, count: leads.length });
});

router.get('/:id', (req: Request, res: Response) => {
  const lead = leadsDB.get(req.params.id);
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  res.json(lead);
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { email, name, company, notes } = req.body;

    if (!email || !name || !company) {
      res
        .status(400)
        .json({ error: 'Email, name, and company are required' });
      return;
    }

    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const lead: Lead = {
      id,
      email,
      name,
      company,
      status: 'new',
      score: 0,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    leadsDB.set(id, lead);
    logger.info({ leadId: id }, 'Lead created');
    res.status(201).json(lead);
  } catch (error) {
    logger.error(error, 'Error creating lead');
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const lead = leadsDB.get(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const updated = { ...lead, ...req.body, updatedAt: new Date() };
    leadsDB.set(req.params.id, updated);
    logger.info({ leadId: req.params.id }, 'Lead updated');
    res.json(updated);
  } catch (error) {
    logger.error(error, 'Error updating lead');
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = leadsDB.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  logger.info({ leadId: req.params.id }, 'Lead deleted');
  res.json({ success: true });
});

export default router;
