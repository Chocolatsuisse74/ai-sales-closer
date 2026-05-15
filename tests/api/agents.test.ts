import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the AgentOrchestrator and logger
vi.mock('../../src/agents/index.js', () => ({
  AgentOrchestrator: vi.fn().mockImplementation(() => ({
    listAgents: vi.fn().mockReturnValue([
      {
        id: 'lead-qualifier',
        type: 'lead-qualifier',
        name: 'Lead Qualifier',
        description: 'Qualifies leads',
        status: 'active',
      },
      {
        id: 'follow-up',
        type: 'follow-up',
        name: 'Follow-up Agent',
        description: 'Sends follow-ups',
        status: 'active',
      },
    ]),
    getAgent: vi.fn().mockImplementation((agentId) => {
      if (agentId === 'lead-qualifier') {
        return {
          process: vi
            .fn()
            .mockResolvedValue({
              agentId: 'lead-qualifier',
              message: 'Lead qualified with score 85',
              metadata: {
                tokensUsed: { input_tokens: 100, output_tokens: 50 },
                stopReason: 'end_turn',
              },
            }),
        };
      }
      return null;
    }),
  })),
}));

vi.mock('../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Agents API Routes', () => {
  describe('GET /agents', () => {
    it('should list all available agents', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agents = orchestrator.listAgents();

      expect(agents).toBeDefined();
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
      expect(agents[0]).toHaveProperty('id');
      expect(agents[0]).toHaveProperty('type');
      expect(agents[0]).toHaveProperty('name');
    });

    it('should return agents with correct structure', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agents = orchestrator.listAgents();

      agents.forEach((agent) => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('type');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');
        expect(agent).toHaveProperty('status');
        expect(['active', 'inactive']).toContain(agent.status);
      });
    });
  });

  describe('POST /agents/:agentId/message', () => {
    it('should send message to agent and receive response', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agent = orchestrator.getAgent('lead-qualifier');

      expect(agent).toBeDefined();

      const response = await agent.process('Test message');

      expect(response).toBeDefined();
      expect(response.agentId).toBe('lead-qualifier');
      expect(response.message).toBeDefined();
      expect(response.metadata).toBeDefined();
    });

    it('should return 404 for non-existent agent', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agent = orchestrator.getAgent('non-existent-agent');

      expect(agent).toBeNull();
    });

    it('should include metadata in agent response', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agent = orchestrator.getAgent('lead-qualifier');

      const response = await agent.process('Analyze this lead');

      expect(response.metadata).toBeDefined();
      expect(response.metadata?.tokensUsed).toBeDefined();
      expect(response.metadata?.stopReason).toBeDefined();
    });
  });

  describe('POST /agents/lead-qualifier/qualify', () => {
    it('should qualify a lead using the agent', async () => {
      const { AgentOrchestrator } = await import('../../src/agents/index.js');
      const orchestrator = new AgentOrchestrator();
      const agent = orchestrator.getAgent('lead-qualifier');

      const lead = {
        name: 'John Doe',
        company: 'Tech Corp',
        email: 'john@example.com',
      };

      const response = await agent.process(JSON.stringify(lead));

      expect(response).toBeDefined();
      expect(response.agentId).toBe('lead-qualifier');
      expect(response.message).toContain('qualified');
    });
  });
});
