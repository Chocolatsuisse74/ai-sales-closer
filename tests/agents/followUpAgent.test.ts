import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FollowUpAgent } from '../../src/agents/implementations/followUpAgent.js';
import { Logger } from 'pino';

// Mock Anthropic client
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'Follow-up message response',
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 75,
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

describe('FollowUpAgent', () => {
  let agent: FollowUpAgent;

  beforeEach(() => {
    agent = new FollowUpAgent(mockLogger);
    vi.clearAllMocks();
  });

  it('should initialize with correct properties', () => {
    expect(agent.constructor.name).toBe('FollowUpAgent');
  });

  it('should process follow-up message', async () => {
    const response = await agent.process('Please send a follow-up email');

    expect(response).toBeDefined();
    expect(response.agentId).toBe('follow-up');
    expect(response.message).toBe('Follow-up message response');
  });

  it('should generate follow-up for qualified lead', async () => {
    const leadInfo = {
      name: 'John Doe',
      company: 'Tech Corp',
      lastInteraction: new Date().toISOString(),
      notes: 'Interested in demo',
    };

    const response = await agent.process(JSON.stringify(leadInfo));

    expect(response).toBeDefined();
    expect(response.message).toBe('Follow-up message response');
    expect(response.metadata?.tokensUsed).toBeDefined();
  });

  it('should maintain conversation history across multiple calls', async () => {
    await agent.process('First follow-up message');
    await agent.process('Second follow-up message');

    const history = agent.getHistory();
    expect(history.length).toBeGreaterThan(0);
  });

  it('should clear history when requested', async () => {
    await agent.process('Test message');
    agent.clearHistory();

    const history = agent.getHistory();
    expect(history.length).toBe(0);
  });
});
