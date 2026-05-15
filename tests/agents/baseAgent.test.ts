import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseAgent } from '../../src/agents/baseAgent.js';
import { Logger } from 'pino';

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'Agent response message',
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

class TestAgent extends BaseAgent {
  constructor(logger: Logger) {
    super('test-agent', 'Test Agent', 'You are a test agent', logger);
  }
}

describe('BaseAgent', () => {
  let agent: TestAgent;

  beforeEach(() => {
    agent = new TestAgent(mockLogger);
    vi.clearAllMocks();
  });

  it('should initialize with correct id and name', () => {
    expect(agent.constructor.name).toBe('TestAgent');
  });

  it('should process messages successfully', async () => {
    const response = await agent.process('Test message');

    expect(response).toBeDefined();
    expect(response.agentId).toBe('test-agent');
    expect(response.message).toBe('Agent response message');
  });

  it('should track conversation history', async () => {
    await agent.process('First message');
    const history = agent.getHistory();

    expect(history.length).toBeGreaterThan(0);
    expect(history[0].role).toBe('user');
    expect(history[0].content).toBe('First message');
  });

  it('should maintain multiple turns in conversation history', async () => {
    await agent.process('First message');
    await agent.process('Second message');

    const history = agent.getHistory();
    expect(history.length).toBeGreaterThanOrEqual(2);
  });

  it('should clear history when requested', async () => {
    await agent.process('Test message');
    expect(agent.getHistory().length).toBeGreaterThan(0);

    agent.clearHistory();
    expect(agent.getHistory().length).toBe(0);
  });

  it('should include token usage in response metadata', async () => {
    const response = await agent.process('Test message');

    expect(response.metadata).toBeDefined();
    expect(response.metadata?.tokensUsed).toBeDefined();
    expect(response.metadata?.stopReason).toBe('end_turn');
  });

  it('should include correct response structure', async () => {
    const response = await agent.process('Test message');

    expect(response).toHaveProperty('agentId');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('metadata');
  });
});
