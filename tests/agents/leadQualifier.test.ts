import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LeadQualifier } from '../../src/agents/implementations/leadQualifier.js';
import { Logger } from 'pino';

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'Lead qualification response',
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 50,
        },
        stop_reason: 'end_turn',
      }),
    },
  })),
}));

const mockLogger: Logger = {
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
} as unknown as Logger;

describe('LeadQualifier Agent', () => {
  let agent: LeadQualifier;

  beforeEach(() => {
    agent = new LeadQualifier(mockLogger);
    vi.clearAllMocks();
  });

  it('should initialize with correct properties', () => {
    expect(agent.constructor.name).toBe('LeadQualifier');
  });

  it('should qualify a lead', async () => {
    const lead = {
      id: 'lead_123',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      status: 'new' as const,
      score: 0,
      notes: 'Interested in our solution',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await agent.qualifyLead(lead);

    expect(response).toBeDefined();
    expect(response.agentId).toBe('lead-qualifier');
    expect(response.message).toBe('Lead qualification response');
    expect(response.metadata?.tokensUsed).toBeDefined();
  });

  it('should analyze lead data', async () => {
    const leadData = {
      companySize: 'medium',
      industry: 'technology',
      budget: 'high',
      timeline: 'immediate',
    };

    const response = await agent.analyzeLead(leadData);

    expect(response).toBeDefined();
    expect(response.agentId).toBe('lead-qualifier');
    expect(response.message).toBe('Lead qualification response');
  });

  it('should maintain conversation history', async () => {
    const lead = {
      id: 'lead_123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Sales Inc',
      status: 'new' as const,
      score: 0,
      notes: 'Follow up needed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response1 = await agent.qualifyLead(lead);
    const history = agent.getHistory();

    expect(history.length).toBeGreaterThan(0);
    expect(response1.message).toBe('Lead qualification response');
  });

  it('should clear conversation history', async () => {
    const lead = {
      id: 'lead_123',
      name: 'Test Lead',
      email: 'test@example.com',
      company: 'Test Corp',
      status: 'new' as const,
      score: 0,
      notes: 'Test notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await agent.qualifyLead(lead);
    agent.clearHistory();

    const history = agent.getHistory();
    expect(history.length).toBe(0);
  });
});
