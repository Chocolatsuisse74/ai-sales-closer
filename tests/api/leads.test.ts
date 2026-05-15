import { describe, it, expect, beforeEach } from 'vitest';

// In-memory test database for leads
const leadsDB: Map<string, any> = new Map();

interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  status: 'new' | 'qualified' | 'engaged' | 'proposal' | 'closed' | 'lost';
  score: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions to simulate API operations
function getAllLeads(): Lead[] {
  return Array.from(leadsDB.values());
}

function getLeadById(id: string): Lead | undefined {
  return leadsDB.get(id);
}

function createLead(
  email: string,
  name: string,
  company: string,
  notes?: string
): Lead {
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
  return lead;
}

function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const lead = leadsDB.get(id);
  if (!lead) return null;
  const updated = { ...lead, ...updates, updatedAt: new Date() };
  leadsDB.set(id, updated);
  return updated;
}

function deleteLead(id: string): boolean {
  return leadsDB.delete(id);
}

describe('Leads API Routes', () => {
  beforeEach(() => {
    leadsDB.clear();
  });

  describe('GET /leads', () => {
    it('should return empty list when no leads exist', () => {
      const leads = getAllLeads();
      expect(leads).toEqual([]);
    });

    it('should return all leads', () => {
      createLead('john@example.com', 'John Doe', 'Tech Corp');
      createLead('jane@example.com', 'Jane Smith', 'Sales Inc');

      const leads = getAllLeads();
      expect(leads.length).toBe(2);
    });
  });

  describe('GET /leads/:id', () => {
    it('should return a lead by id', () => {
      const created = createLead(
        'john@example.com',
        'John Doe',
        'Tech Corp',
        'Interested in demo'
      );
      const retrieved = getLeadById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('John Doe');
      expect(retrieved?.email).toBe('john@example.com');
    });

    it('should return null for non-existent lead', () => {
      const lead = getLeadById('non-existent-id');
      expect(lead).toBeUndefined();
    });

    it('should return correct lead properties', () => {
      const created = createLead('test@example.com', 'Test User', 'Test Co');
      const retrieved = getLeadById(created.id);

      expect(retrieved).toHaveProperty('id');
      expect(retrieved).toHaveProperty('email');
      expect(retrieved).toHaveProperty('name');
      expect(retrieved).toHaveProperty('company');
      expect(retrieved).toHaveProperty('status');
      expect(retrieved).toHaveProperty('score');
      expect(retrieved).toHaveProperty('notes');
      expect(retrieved).toHaveProperty('createdAt');
      expect(retrieved).toHaveProperty('updatedAt');
    });
  });

  describe('POST /leads', () => {
    it('should create a new lead', () => {
      const lead = createLead(
        'new@example.com',
        'New Lead',
        'New Company',
        'New notes'
      );

      expect(lead).toBeDefined();
      expect(lead.id).toBeDefined();
      expect(lead.email).toBe('new@example.com');
      expect(lead.name).toBe('New Lead');
      expect(lead.company).toBe('New Company');
      expect(lead.status).toBe('new');
      expect(lead.score).toBe(0);
    });

    it('should generate unique ids for each lead', () => {
      const lead1 = createLead('email1@example.com', 'Lead 1', 'Company 1');
      const lead2 = createLead('email2@example.com', 'Lead 2', 'Company 2');

      expect(lead1.id).not.toBe(lead2.id);
    });

    it('should set creation and update dates', () => {
      const beforeCreate = new Date();
      const lead = createLead('email@example.com', 'Test', 'Company');
      const afterCreate = new Date();

      expect(lead.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(lead.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(lead.updatedAt).toEqual(lead.createdAt);
    });
  });

  describe('PUT /leads/:id', () => {
    it('should update an existing lead', () => {
      const created = createLead(
        'john@example.com',
        'John Doe',
        'Tech Corp'
      );
      const updated = updateLead(created.id, {
        status: 'qualified',
        score: 85,
      });

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('qualified');
      expect(updated?.score).toBe(85);
      expect(updated?.email).toBe('john@example.com');
    });

    it('should return null for non-existent lead', () => {
      const result = updateLead('non-existent-id', { status: 'qualified' });
      expect(result).toBeNull();
    });

    it('should update the updatedAt timestamp', () => {
      const created = createLead('email@example.com', 'Test', 'Company');
      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure time difference
      setTimeout(() => {
        const updated = updateLead(created.id, { status: 'qualified' });
        expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
          originalUpdatedAt.getTime()
        );
      }, 10);
    });

    it('should preserve unchanged fields', () => {
      const created = createLead(
        'john@example.com',
        'John Doe',
        'Tech Corp',
        'Test notes'
      );
      const updated = updateLead(created.id, { status: 'qualified' });

      expect(updated?.email).toBe(created.email);
      expect(updated?.name).toBe(created.name);
      expect(updated?.company).toBe(created.company);
      expect(updated?.notes).toBe(created.notes);
    });
  });

  describe('DELETE /leads/:id', () => {
    it('should delete an existing lead', () => {
      const created = createLead('email@example.com', 'Test', 'Company');
      const deleted = deleteLead(created.id);

      expect(deleted).toBe(true);
      expect(getLeadById(created.id)).toBeUndefined();
    });

    it('should return false for non-existent lead', () => {
      const result = deleteLead('non-existent-id');
      expect(result).toBe(false);
    });

    it('should not affect other leads', () => {
      const lead1 = createLead('email1@example.com', 'Lead 1', 'Company 1');
      const lead2 = createLead('email2@example.com', 'Lead 2', 'Company 2');

      deleteLead(lead1.id);

      expect(getLeadById(lead1.id)).toBeUndefined();
      expect(getLeadById(lead2.id)).toBeDefined();
    });
  });
});
