import Anthropic from '@anthropic-ai/sdk';
import { Logger } from 'pino';
import { AgentMessage, AgentResponse } from '../types/index.js';

export abstract class BaseAgent {
  protected client: Anthropic;
  protected id: string;
  protected name: string;
  protected systemPrompt: string;
  protected logger: Logger;
  protected conversationHistory: AgentMessage[] = [];

  constructor(
    id: string,
    name: string,
    systemPrompt: string,
    logger: Logger
  ) {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.id = id;
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.logger = logger;
  }

  async process(userMessage: string): Promise<AgentResponse> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      const response = await this.client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 1024,
        system: this.systemPrompt,
        messages: this.conversationHistory,
      });

      const assistantMessage =
        response.content[0].type === 'text' ? response.content[0].text : '';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return {
        agentId: this.id,
        message: assistantMessage,
        metadata: {
          tokensUsed: response.usage,
          stopReason: response.stop_reason,
        },
      };
    } catch (error) {
      this.logger.error(
        { error, agentId: this.id },
        'Error processing message'
      );
      throw error;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): AgentMessage[] {
    return this.conversationHistory;
  }
}
