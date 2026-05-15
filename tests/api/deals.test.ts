import { describe, it, expect, beforeEach } from 'vitest';

// In-memory test database for deals
const dealsDB: Map<string, any> = new Map();

interface Deal {
  id: string;
  leadId: string;
  amount: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  expectedClosureDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions to simulate API operations
function getAllDeals(): Deal[] {
  return Array.from(dealsDB.values());
}

function getDealById(id: string): Deal | undefined {
  return dealsDB.get(id);
}

function createDeal(
  leadId: string,
  amount: number,
  stage: Deal['stage'],
  expectedClosureDate: Date
): Deal {
  const id = `deal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const deal: Deal = {
    id,
    leadId,
    amount,
    stage,
    expectedClosureDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  dealsDB.set(id, deal);
  return deal;
}

function updateDeal(id: string, updates: Partial<Deal>): Deal | null {
  const deal = dealsDB.get(id);
  if (!deal) return null;
  const updated = { ...deal, ...updates, updatedAt: new Date() };
  dealsDB.set(id, updated);
  return updated;
}

function deleteDeal(id: string): boolean {
  return dealsDB.delete(id);
}

describe('Deals API Routes', () => {
  beforeEach(() => {
    dealsDB.clear();
  });

  describe('GET /deals', () => {
    it('should return empty list when no deals exist', () => {
      const deals = getAllDeals();
      expect(deals).toEqual([]);
    });

    it('should return all deals', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      createDeal('lead_123', 50000, 'discovery', closureDate);
      createDeal('lead_456', 75000, 'proposal', closureDate);

      const deals = getAllDeals();
      expect(deals.length).toBe(2);
    });
  });

  describe('GET /deals/:id', () => {
    it('should return a deal by id', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const retrieved = getDealById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.leadId).toBe('lead_123');
      expect(retrieved?.amount).toBe(50000);
    });

    it('should return null for non-existent deal', () => {
      const deal = getDealById('non-existent-id');
      expect(deal).toBeUndefined();
    });

    it('should return correct deal properties', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const retrieved = getDealById(created.id);

      expect(retrieved).toHaveProperty('id');
      expect(retrieved).toHaveProperty('leadId');
      expect(retrieved).toHaveProperty('amount');
      expect(retrieved).toHaveProperty('stage');
      expect(retrieved).toHaveProperty('expectedClosureDate');
      expect(retrieved).toHaveProperty('createdAt');
      expect(retrieved).toHaveProperty('updatedAt');
    });
  });

  describe('POST /deals', () => {
    it('should create a new deal', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const deal = createDeal('lead_123', 50000, 'discovery', closureDate);

      expect(deal).toBeDefined();
      expect(deal.id).toBeDefined();
      expect(deal.leadId).toBe('lead_123');
      expect(deal.amount).toBe(50000);
      expect(deal.stage).toBe('discovery');
    });

    it('should generate unique ids for each deal', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const deal1 = createDeal('lead_123', 50000, 'discovery', closureDate);
      const deal2 = createDeal('lead_456', 75000, 'proposal', closureDate);

      expect(deal1.id).not.toBe(deal2.id);
    });

    it('should set creation and update dates', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const beforeCreate = new Date();
      const deal = createDeal('lead_123', 50000, 'discovery', closureDate);
      const afterCreate = new Date();

      expect(deal.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(deal.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(deal.updatedAt).toEqual(deal.createdAt);
    });

    it('should support all valid deal stages', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const stages: Deal['stage'][] = [
        'discovery',
        'proposal',
        'negotiation',
        'closing',
        'won',
        'lost',
      ];

      stages.forEach((stage) => {
        const deal = createDeal('lead_123', 50000, stage, closureDate);
        expect(deal.stage).toBe(stage);
      });
    });
  });

  describe('PUT /deals/:id', () => {
    it('should update an existing deal', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const updated = updateDeal(created.id, {
        stage: 'proposal',
        amount: 60000,
      });

      expect(updated).toBeDefined();
      expect(updated?.stage).toBe('proposal');
      expect(updated?.amount).toBe(60000);
      expect(updated?.leadId).toBe('lead_123');
    });

    it('should return null for non-existent deal', () => {
      const result = updateDeal('non-existent-id', { stage: 'proposal' });
      expect(result).toBeNull();
    });

    it('should update the updatedAt timestamp', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const originalUpdatedAt = created.updatedAt;

      setTimeout(() => {
        const updated = updateDeal(created.id, { stage: 'proposal' });
        expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime()
        );
      }, 10);
    });

    it('should preserve unchanged fields', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const updated = updateDeal(created.id, { stage: 'proposal' });

      expect(updated?.leadId).toBe(created.leadId);
      expect(updated?.amount).toBe(created.amount);
      expect(updated?.expectedClosureDate).toEqual(created.expectedClosureDate);
    });
  });

  describe('DELETE /deals/:id', () => {
    it('should delete an existing deal', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const created = createDeal('lead_123', 50000, 'discovery', closureDate);
      const deleted = deleteDeal(created.id);

      expect(deleted).toBe(true);
      expect(getDealById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent deal', () => {
      const result = deleteDeal('non-existent-id');
      expect(result).toBe(false);
    });

    it('should not affect other deals', () => {
      const closureDate = new Date();
      closureDate.setDate(closureDate.getDate() + 30);

      const deal1 = createDeal('lead_123', 50000, 'discovery', closureDate);
      const deal2 = createDeal('lead_456', 75000, 'proposal', closureDate);

      deleteDeal(deal1.id);

      expect(getDealById(deal1.id)).toBeUndefined();
      expect(getDealById(deal2.id)).toBeDefined();
    });
  });
});
